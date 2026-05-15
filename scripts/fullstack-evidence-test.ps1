param(
  [string]$Root = "D:\SAA\saa-project",
  [string]$PhpExe = "D:\xamp\php\php.exe",
  [string]$ApiBase = "http://127.0.0.1:8000/api",
  [string]$FrontendUrl = "http://127.0.0.1:5173"
)

$ErrorActionPreference = "Stop"

$EvidenceDir = Join-Path $Root "docs\testing-evidence"
New-Item -ItemType Directory -Force -Path $EvidenceDir | Out-Null

$Backend = $null
$Frontend = $null
$Features = New-Object System.Collections.Generic.List[object]
$Validation = New-Object System.Collections.Generic.List[object]
$DbChecks = New-Object System.Collections.Generic.List[object]

function Add-Feature {
  param($Name, $Steps, $DemoData, $Endpoint, $Expected, $Actual, $Evidence, [bool]$Passed)
  $script:Features.Add([PSCustomObject]@{
    feature = $Name; steps = $Steps; demo_data = $DemoData; endpoint = $Endpoint
    expected = $Expected; actual = $Actual; evidence = $Evidence
    status = if ($Passed) { "Passed" } else { "Failed" }
  })
}

function Add-Validation {
  param($Form, $Field, $InvalidInput, $Expected, $Actual, $Evidence, [bool]$Passed)
  $script:Validation.Add([PSCustomObject]@{
    form = $Form; field = $Field; invalid_input = $InvalidInput
    expected = $Expected; actual = $Actual; evidence = $Evidence
    status = if ($Passed) { "Passed" } else { "Failed" }
  })
}

function Add-DbCheck {
  param($Check, $Before, $After, $Expected, $Actual, [bool]$Passed)
  $script:DbChecks.Add([PSCustomObject]@{
    check = $Check; before = $Before; after = $After
    expected = $Expected; actual = $Actual
    status = if ($Passed) { "Passed" } else { "Failed" }
  })
}

function Invoke-Api {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body = $null,
    [hashtable]$Headers = @{}
  )

  $options = @{
    Method = $Method
    Uri = "$ApiBase$Path"
    Headers = $Headers
    TimeoutSec = 15
    UseBasicParsing = $true
  }
  if ($null -ne $Body) {
    $options.ContentType = "application/json"
    $options.Body = ($Body | ConvertTo-Json -Depth 12)
  }

  try {
    $response = Invoke-WebRequest @options
    $parsed = $null
    try { $parsed = $response.Content | ConvertFrom-Json } catch {}
    return [PSCustomObject]@{ ok = $true; status = [int]$response.StatusCode; body = $parsed; raw = $response.Content }
  } catch {
    $status = 0
    $text = $_.Exception.Message
    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode
      try {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
      } catch {}
    }
    $parsed = $null
    try { $parsed = $text | ConvertFrom-Json } catch {}
    return [PSCustomObject]@{ ok = $false; status = $status; body = $parsed; raw = $text }
  }
}

function Load-Db {
  Get-Content -Raw -LiteralPath (Join-Path $Root "backend\data\database.json") | ConvertFrom-Json
}

try {
  $BackendOut = Join-Path $EvidenceDir "backend-server.out.log"
  $BackendErr = Join-Path $EvidenceDir "backend-server.err.log"
  $FrontendOut = Join-Path $EvidenceDir "frontend-server.out.log"
  $FrontendErr = Join-Path $EvidenceDir "frontend-server.err.log"

  $Backend = Start-Process -FilePath $PhpExe -ArgumentList @("-S", "127.0.0.1:8000", "router.php") -WorkingDirectory (Join-Path $Root "backend") -WindowStyle Hidden -RedirectStandardOutput $BackendOut -RedirectStandardError $BackendErr -PassThru
  for ($i = 0; $i -lt 25; $i++) {
    try { $Health = Invoke-RestMethod -Uri $ApiBase -Method GET -TimeoutSec 2; break } catch { Start-Sleep -Milliseconds 400 }
  }
  if (-not $Health.success) { throw "Backend health check failed." }

  $Frontend = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev", "--", "--host", "127.0.0.1") -WorkingDirectory (Join-Path $Root "frontend") -WindowStyle Hidden -RedirectStandardOutput $FrontendOut -RedirectStandardError $FrontendErr -PassThru
  for ($i = 0; $i -lt 60; $i++) {
    try { $Front = Invoke-WebRequest -Uri $FrontendUrl -UseBasicParsing -TimeoutSec 2; break } catch { Start-Sleep -Milliseconds 500 }
  }
  if ($Front.StatusCode -ne 200) { throw "Frontend dev server did not return HTTP 200." }

  Set-Content -LiteralPath (Join-Path $EvidenceDir "frontend-app-shell.html") -Value $Front.Content
  [PSCustomObject]@{
    backend_url = $ApiBase
    backend_pid = $Backend.Id
    backend_health = $Health
    frontend_url = $FrontendUrl
    frontend_pid = $Frontend.Id
    frontend_status = $Front.StatusCode
    frontend_has_react_root = $Front.Content.Contains('<div id="root">')
    backend_log = "docs/testing-evidence/backend-server.err.log"
    frontend_log = "docs/testing-evidence/frontend-server.out.log"
  } | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $EvidenceDir "server-running-evidence.json")

  Add-Feature "Backend health" "Started PHP API and called health endpoint" "N/A" "GET /api" "success=true" "success=$($Health.success); message=$($Health.message)" "docs/testing-evidence/server-running-evidence.json" ($Health.success -eq $true)
  Add-Feature "Frontend dev server" "Started Vite and fetched app shell" "N/A" "GET $FrontendUrl" "HTTP 200 with React root" "status=$($Front.StatusCode); react_root=$($Front.Content.Contains('<div id=""root"">'))" "docs/testing-evidence/frontend-app-shell.html" ($Front.StatusCode -eq 200 -and $Front.Content.Contains('<div id="root">'))

  $Origin = @{ Origin = "http://localhost:5173" }
  $Unique = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  $BeforeDb = Load-Db
  $BeforeCounts = [PSCustomObject]@{
    users = $BeforeDb.users.Count
    universities = $BeforeDb.universities.Count
    scholarships = $BeforeDb.scholarships.Count
    documents = $BeforeDb.documents.Count
  }

  $StudentEmail = "evidence.student.$Unique@test.com"
  $StudentReg = Invoke-Api POST "/auth/register" @{ full_name = "Evidence Test Student"; email = $StudentEmail; phone = "+92 300 5551212"; password = "Test@12345!"; password_confirmation = "Test@12345!" } $Origin
  $StudentId = [int]$StudentReg.body.data.user_id
  Add-Feature "Student registration" "Submitted valid registration payload" $StudentEmail "POST /auth/register" "New student created" "status=$($StudentReg.status); user_id=$StudentId" "docs/testing-evidence/api-feature-results.json; database-verification.json" ($StudentReg.status -eq 201 -and $StudentId -gt 0)

  $StudentLogin = Invoke-Api POST "/auth/login" @{ email = "student@test.com"; password = "Test@1234" } $Origin
  $StudentHeaders = @{ Origin = "http://localhost:5173"; Authorization = "Bearer $($StudentLogin.body.data.token)" }
  Add-Feature "Student login" "Logged in with seeded student credentials" "student@test.com / Test@1234" "POST /auth/login" "Bearer token and student user returned" "status=$($StudentLogin.status); user=$($StudentLogin.body.data.user.email); role=$($StudentLogin.body.data.user.role)" "docs/testing-evidence/api-feature-results.json" ($StudentLogin.ok -and $StudentLogin.body.data.token.Length -gt 20)

  $Dashboard = Invoke-Api GET "/student/dashboard" $null $StudentHeaders
  Add-Feature "Student dashboard" "Loaded dashboard with student token" "student@test.com" "GET /student/dashboard" "Dashboard summary returned" "status=$($Dashboard.status); profile_completion=$($Dashboard.body.data.profile_completion)" "docs/testing-evidence/api-feature-results.json" ($Dashboard.ok -and $null -ne $Dashboard.body.data.profile_completion)

  $Profile = Invoke-Api PUT "/student/profile" @{ nationality = "Pakistan"; current_country = "Pakistan"; current_qualification = "Bachelor's Degree"; gpa = 3.55; field_of_interest = "Computer Science"; degree_level = "Master"; preferred_countries = @("Canada", "Germany"); annual_budget_usd = 18000; ielts_score = 7.5; target_intake = "Fall 2027"; ranking_preference = "Top 500"; needs_scholarship = $true } $StudentHeaders
  Add-Feature "Student profile save" "Submitted valid profile data" "GPA 3.55; Canada/Germany preferences" "PUT /student/profile" "Profile saved and returned" "status=$($Profile.status); gpa=$($Profile.body.data.gpa); degree=$($Profile.body.data.degree_level)" "docs/testing-evidence/api-feature-results.json; database-verification.json" ($Profile.ok -and [double]$Profile.body.data.gpa -eq 3.55)

  $Unis = Invoke-Api GET "/recommendations/universities?country=Germany" $null $StudentHeaders
  Add-Feature "University recommendations" "Requested Germany recommendations" "country=Germany" "GET /recommendations/universities?country=Germany" "Filtered university list returned" "status=$($Unis.status); count=$($Unis.body.data.Count)" "docs/testing-evidence/api-feature-results.json" ($Unis.ok -and $Unis.body.data.Count -ge 1)

  $Schols = Invoke-Api GET "/recommendations/scholarships?coverage=Fully%20Funded" $null $StudentHeaders
  Add-Feature "Scholarship recommendations" "Requested fully funded scholarships" "coverage=Fully Funded" "GET /recommendations/scholarships?coverage=Fully%20Funded" "Filtered scholarship list returned" "status=$($Schols.status); count=$($Schols.body.data.Count)" "docs/testing-evidence/api-feature-results.json" ($Schols.ok -and $Schols.body.data.Count -ge 1)

  $ShortAdd = Invoke-Api POST "/shortlist" @{ entity_type = "university"; entity_id = 1 } $StudentHeaders
  $ShortList = Invoke-Api GET "/shortlist" $null $StudentHeaders
  $ShortDel = Invoke-Api DELETE "/shortlist/1?entity_type=university" $null $StudentHeaders
  Add-Feature "Shortlist add/list/delete" "Added, listed, and removed a university shortlist item" "university id=1" "POST/GET/DELETE /shortlist" "Shortlist updates persisted" "add_status=$($ShortAdd.status); list_count=$($ShortList.body.data.universities.Count); delete_status=$($ShortDel.status)" "docs/testing-evidence/api-feature-results.json; database-verification.json" (($ShortAdd.ok -or $ShortAdd.status -eq 409) -and $ShortList.ok -and $ShortDel.ok)

  $Guide = Invoke-Api GET "/guides/university/1" $null $StudentHeaders
  Add-Feature "Application guide" "Loaded guide for university id 1" "Technical University of Munich" "GET /guides/university/1" "Guide data returned" "status=$($Guide.status); entity=$($Guide.body.data.entity.name); docs=$($Guide.body.data.required_documents.Count)" "docs/testing-evidence/api-feature-results.json" ($Guide.ok -and $Guide.body.data.required_documents.Count -gt 0)

  $Roadmap = Invoke-Api GET "/roadmap" $null $StudentHeaders
  $MilestoneId = [int]$Roadmap.body.data.milestones[0].id
  $Milestone = Invoke-Api PATCH "/roadmap/milestones/$MilestoneId" @{ status = "Done" } $StudentHeaders
  Add-Feature "Roadmap" "Loaded roadmap and updated first milestone status" "milestone=$MilestoneId" "GET /roadmap; PATCH /roadmap/milestones/:id" "Milestones returned and update succeeds" "load_status=$($Roadmap.status); milestones=$($Roadmap.body.data.milestones.Count); patch_status=$($Milestone.status)" "docs/testing-evidence/api-feature-results.json; database-verification.json" ($Roadmap.ok -and $Milestone.ok)

  $Templates = Invoke-Api GET "/templates" $null $StudentHeaders
  $TemplateFile = Join-Path $EvidenceDir "template-$Unique.pdf"
  Invoke-WebRequest -UseBasicParsing -Uri "$ApiBase/templates/1/download?format=pdf" -Headers $StudentHeaders -OutFile $TemplateFile | Out-Null
  Add-Feature "Templates" "Listed templates and downloaded PDF template" "template id=1; format=pdf" "GET /templates; GET /templates/1/download?format=pdf" "Templates listed and PDF file saved" "list_status=$($Templates.status); count=$($Templates.body.data.Count); file_bytes=$((Get-Item $TemplateFile).Length)" "docs/testing-evidence/api-feature-results.json; docs/testing-evidence/template-*.pdf" ($Templates.ok -and (Get-Item $TemplateFile).Length -gt 100)

  $Doc = Invoke-Api POST "/writing/generate" @{ document_type = "sop"; target_university = "University of Toronto"; target_program = "MSc Computer Science"; achievements = "built a study planning system"; background = "computer science graduate from Pakistan"; word_limit = 500 } $StudentHeaders
  $DocId = [int]$Doc.body.data.id
  $Refined = Invoke-Api POST "/writing/$DocId/refine" @{ instructions = "Make it more formal" } $StudentHeaders
  $Saved = Invoke-Api PUT "/writing/$DocId" @{ content = $Refined.body.data.content } $StudentHeaders
  Add-Feature "Writing assistant" "Generated, refined, and saved a document" "SOP for University of Toronto" "POST /writing/generate; POST /writing/:id/refine; PUT /writing/:id" "Document lifecycle succeeds" "generate_status=$($Doc.status); document=$DocId; refine_status=$($Refined.status); save_status=$($Saved.status)" "docs/testing-evidence/api-feature-results.json; database-verification.json" ($Doc.ok -and $Refined.ok -and $Saved.ok)

  $AdminLogin = Invoke-Api POST "/auth/admin/login" @{ email = "admin@saa.local"; password = "Admin@12345" } $Origin
  $AdminHeaders = @{ Origin = "http://localhost:5173"; Authorization = "Bearer $($AdminLogin.body.data.token)" }
  Add-Feature "Admin login" "Logged in with seeded admin credentials via alias endpoint" "admin@saa.local / Admin@12345" "POST /auth/admin/login" "Admin bearer token returned" "status=$($AdminLogin.status); user=$($AdminLogin.body.data.user.email); role=$($AdminLogin.body.data.user.role)" "docs/testing-evidence/api-feature-results.json" ($AdminLogin.ok -and $AdminLogin.body.data.user.role -eq "admin")

  $AdminDashboard = Invoke-Api GET "/admin/dashboard" $null $AdminHeaders
  Add-Feature "Admin dashboard" "Loaded admin dashboard stats" "admin token" "GET /admin/dashboard" "Counts and recent registrations returned" "status=$($AdminDashboard.status); students=$($AdminDashboard.body.data.total_students); universities=$($AdminDashboard.body.data.total_universities)" "docs/testing-evidence/api-feature-results.json" ($AdminDashboard.ok -and $AdminDashboard.body.data.total_universities -ge 1)

  $CreateUni = Invoke-Api POST "/admin/universities" @{ name = "Evidence University $Unique"; country = "Canada"; city = "Toronto"; ranking = 321; programs = @("Computer Science", "Business"); gpa_requirement = 3.2; tuition_fee_usd = 15000; application_deadline = "2027-12-01"; portal_url = "https://example.edu/apply"; description = "Created during evidence testing" } $AdminHeaders
  $UniId = [int]$CreateUni.body.data.id
  $DbAfterUniCreate = Load-Db
  $DbUniCreated = $DbAfterUniCreate.universities | Where-Object { $_.id -eq $UniId }
  $UpdateUni = Invoke-Api PUT "/admin/universities/$UniId" @{ city = "Vancouver"; portal_url = "https://example.edu/updated" } $AdminHeaders
  $DbAfterUniUpdate = Load-Db
  $DbUniUpdated = $DbAfterUniUpdate.universities | Where-Object { $_.id -eq $UniId }
  $DeleteUni = Invoke-Api DELETE "/admin/universities/$UniId" $null $AdminHeaders
  $DbAfterUniDelete = Load-Db
  $DbUniDeleted = @($DbAfterUniDelete.universities | Where-Object { $_.id -eq $UniId }).Count -eq 0
  Add-Feature "Admin university CRUD" "Created, verified in DB, updated, verified in DB, and deleted university" "Evidence University $Unique" "POST/PUT/DELETE /admin/universities" "CRUD works and database changes are visible" "create=$($CreateUni.status); id=$UniId; db_created=$($null -ne $DbUniCreated); updated_city=$($DbUniUpdated.city); delete=$($DeleteUni.status); db_deleted=$DbUniDeleted" "docs/testing-evidence/api-feature-results.json; database-verification.json" ($CreateUni.ok -and $UpdateUni.ok -and $DeleteUni.ok -and $DbUniDeleted)
  Add-DbCheck "University create/update/delete" $BeforeCounts.universities $DbAfterUniDelete.universities.Count "Created item appears, update persists, deleted item absent" "created=$($null -ne $DbUniCreated); updated_city=$($DbUniUpdated.city); deleted=$DbUniDeleted" ($null -ne $DbUniCreated -and $DbUniUpdated.city -eq "Vancouver" -and $DbUniDeleted)

  $CreateScholarship = Invoke-Api POST "/admin/scholarships" @{ name = "Evidence Scholarship $Unique"; provider = "SAA Foundation"; country = "Global"; coverage_type = "Full"; amount = '$10,000 / year'; application_deadline = "2027-09-15"; portal_url = "https://example.edu/scholarship"; eligibility = "GPA above 3.0" } $AdminHeaders
  $ScholarshipId = [int]$CreateScholarship.body.data.id
  $DbAfterSchCreate = Load-Db
  $DbSchCreated = $DbAfterSchCreate.scholarships | Where-Object { $_.id -eq $ScholarshipId }
  $UpdateScholarship = Invoke-Api PUT "/admin/scholarships/$ScholarshipId" @{ coverage_type = "Partial"; amount = '$5,000 / year' } $AdminHeaders
  $DbAfterSchUpdate = Load-Db
  $DbSchUpdated = $DbAfterSchUpdate.scholarships | Where-Object { $_.id -eq $ScholarshipId }
  $DeleteScholarship = Invoke-Api DELETE "/admin/scholarships/$ScholarshipId" $null $AdminHeaders
  $DbAfterSchDelete = Load-Db
  $DbSchDeleted = @($DbAfterSchDelete.scholarships | Where-Object { $_.id -eq $ScholarshipId }).Count -eq 0
  Add-Feature "Admin scholarship CRUD" "Created, verified in DB, updated, verified in DB, and deleted scholarship" "Evidence Scholarship $Unique" "POST/PUT/DELETE /admin/scholarships" "CRUD works and database changes are visible" "create=$($CreateScholarship.status); id=$ScholarshipId; db_created=$($null -ne $DbSchCreated); updated_coverage=$($DbSchUpdated.coverage); delete=$($DeleteScholarship.status); db_deleted=$DbSchDeleted" "docs/testing-evidence/api-feature-results.json; database-verification.json" ($CreateScholarship.ok -and $UpdateScholarship.ok -and $DeleteScholarship.ok -and $DbSchDeleted)
  Add-DbCheck "Scholarship create/update/delete" $BeforeCounts.scholarships $DbAfterSchDelete.scholarships.Count "Created item appears, update persists, deleted item absent" "created=$($null -ne $DbSchCreated); updated_coverage=$($DbSchUpdated.coverage); deleted=$DbSchDeleted" ($null -ne $DbSchCreated -and $DbSchUpdated.coverage -eq "Partial Funding" -and $DbSchDeleted)

  $Students = Invoke-Api GET "/admin/students" $null $AdminHeaders
  $StatusChange = Invoke-Api PATCH "/admin/students/$StudentId/status" @{ status = "inactive" } $AdminHeaders
  $DbAfterStudentStatus = Load-Db
  $DbStudentInactive = $DbAfterStudentStatus.users | Where-Object { $_.id -eq $StudentId }
  $DeleteStudent = Invoke-Api DELETE "/admin/students/$StudentId" $null $AdminHeaders
  $DbAfterStudentDelete = Load-Db
  $DbStudentDeleted = @($DbAfterStudentDelete.users | Where-Object { $_.id -eq $StudentId }).Count -eq 0
  Add-Feature "Admin students" "Listed students, changed temporary student status, and deleted temporary student" "student_id=$StudentId" "GET /admin/students; PATCH /admin/students/:id/status; DELETE /admin/students/:id" "Student data includes profile fields; status/delete persists" "list=$($Students.status); status=$($StatusChange.status); db_status=$($DbStudentInactive.status); delete=$($DeleteStudent.status); db_deleted=$DbStudentDeleted" "docs/testing-evidence/api-feature-results.json; database-verification.json" ($Students.ok -and $StatusChange.ok -and $DeleteStudent.ok -and $DbStudentDeleted)
  Add-DbCheck "Student status/delete" $BeforeCounts.users $DbAfterStudentDelete.users.Count "Temporary student status changes then student is deleted" "status_before_delete=$($DbStudentInactive.status); deleted=$DbStudentDeleted" ($DbStudentInactive.status -eq "inactive" -and $DbStudentDeleted)

  $EmptyRequired = Invoke-Api POST "/auth/register" @{ full_name = ""; email = ""; phone = ""; password = ""; password_confirmation = "" } $Origin
  Add-Validation "Registration" "Required fields" "empty values" "422 rejected" "status=$($EmptyRequired.status); message=$($EmptyRequired.body.message)" "docs/testing-evidence/validation-results.json" ($EmptyRequired.status -eq 422)
  $BadEmail = Invoke-Api POST "/auth/register" @{ full_name = "Bad Email User"; email = "abc"; phone = "+92 300 0000000"; password = "Test@12345!"; password_confirmation = "Test@12345!" } $Origin
  Add-Validation "Registration" "Email" "abc" "422 rejected" "status=$($BadEmail.status); message=$($BadEmail.body.message)" "docs/testing-evidence/validation-results.json" ($BadEmail.status -eq 422)
  $WrongPassword = Invoke-Api POST "/auth/login" @{ email = "student@test.com"; password = "WrongPass123!" } $Origin
  Add-Validation "Login" "Password" "WrongPass123!" "401 rejected" "status=$($WrongPassword.status); message=$($WrongPassword.body.message)" "docs/testing-evidence/validation-results.json" ($WrongPassword.status -eq 401)
  $Mismatch = Invoke-Api POST "/auth/register" @{ full_name = "Mismatch User"; email = "mismatch.$Unique@test.com"; phone = "+92 300 0000000"; password = "Test@12345!"; password_confirmation = "Different@123" } $Origin
  Add-Validation "Registration" "Confirm password" "Different@123" "422 rejected" "status=$($Mismatch.status); message=$($Mismatch.body.message)" "docs/testing-evidence/validation-results.json" ($Mismatch.status -eq 422)
  $TooShort = Invoke-Api POST "/auth/register" @{ full_name = "A"; email = "short.$Unique@test.com"; phone = "+92 300 0000000"; password = "Test@12345!"; password_confirmation = "Test@12345!" } $Origin
  Add-Validation "Registration" "Full name" "A" "422 rejected" "status=$($TooShort.status); message=$($TooShort.body.message)" "docs/testing-evidence/validation-results.json" ($TooShort.status -eq 422)
  $TooLong = Invoke-Api POST "/auth/register" @{ full_name = ("A" * 121); email = "long.$Unique@test.com"; phone = "+92 300 0000000"; password = "Test@12345!"; password_confirmation = "Test@12345!" } $Origin
  Add-Validation "Registration" "Full name" "121 characters" "422 rejected" "status=$($TooLong.status); message=$($TooLong.body.message)" "docs/testing-evidence/validation-results.json" ($TooLong.status -eq 422)
  $ScriptName = Invoke-Api POST "/auth/register" @{ full_name = "<script>alert(1)</script>"; email = "script.$Unique@test.com"; phone = "+92 300 0000000"; password = "Test@12345!"; password_confirmation = "Test@12345!" } $Origin
  $ScriptSaved = @((Load-Db).users | Where-Object { $_.email -eq "script.$Unique@test.com" }).Count -gt 0
  Add-Validation "Registration" "Full name" "<script>alert(1)</script>" "422 rejected and not saved" "status=$($ScriptName.status); saved=$ScriptSaved" "docs/testing-evidence/validation-results.json; database-verification.json" ($ScriptName.status -eq 422 -and -not $ScriptSaved)
  $Duplicate = Invoke-Api POST "/auth/register" @{ full_name = "Duplicate User"; email = "student@test.com"; phone = "+92 300 0000000"; password = "Test@12345!"; password_confirmation = "Test@12345!" } $Origin
  Add-Validation "Registration" "Email uniqueness" "student@test.com" "422 rejected" "status=$($Duplicate.status); message=$($Duplicate.body.message)" "docs/testing-evidence/validation-results.json" ($Duplicate.status -eq 422)
  $Unauthorized = Invoke-Api GET "/student/dashboard" $null $Origin
  Add-Validation "Protected route" "Authorization" "missing bearer token" "401 rejected" "status=$($Unauthorized.status); message=$($Unauthorized.body.message)" "docs/testing-evidence/validation-results.json" ($Unauthorized.status -eq 401)
  $BadGpa = Invoke-Api PUT "/student/profile" @{ gpa = 9.9 } $StudentHeaders
  Add-Validation "Student profile" "GPA" "9.9" "422 rejected" "status=$($BadGpa.status); message=$($BadGpa.body.message)" "docs/testing-evidence/validation-results.json" ($BadGpa.status -eq 422)
  $Letters = Invoke-Api POST "/admin/universities" @{ name = "Letters Numeric $Unique"; country = "Canada"; programs = @("CS"); tuition_fee_usd = "abc"; gpa_requirement = "xyz"; application_deadline = "2027-12-01"; portal_url = "https://example.edu" } $AdminHeaders
  $LettersSaved = @((Load-Db).universities | Where-Object { $_.name -eq "Letters Numeric $Unique" }).Count -gt 0
  Add-Validation "Admin university" "Numeric fields" "tuition=abc, gpa=xyz" "422 rejected and not saved" "status=$($Letters.status); saved=$LettersSaved" "docs/testing-evidence/validation-results.json; database-verification.json" ($Letters.status -eq 422 -and -not $LettersSaved)
  $Negative = Invoke-Api POST "/admin/universities" @{ name = "Negative Tuition $Unique"; country = "Canada"; programs = @("CS"); tuition_fee_usd = -100; application_deadline = "2027-12-01"; portal_url = "https://example.edu" } $AdminHeaders
  $NegativeSaved = @((Load-Db).universities | Where-Object { $_.name -eq "Negative Tuition $Unique" }).Count -gt 0
  Add-Validation "Admin university" "Tuition" "-100" "422 rejected and not saved" "status=$($Negative.status); saved=$NegativeSaved" "docs/testing-evidence/validation-results.json; database-verification.json" ($Negative.status -eq 422 -and -not $NegativeSaved)
  $InvalidDate = Invoke-Api POST "/admin/universities" @{ name = "Invalid Date $Unique"; country = "Canada"; programs = @("CS"); application_deadline = "not-a-date"; portal_url = "https://example.edu" } $AdminHeaders
  $DateSaved = @((Load-Db).universities | Where-Object { $_.name -eq "Invalid Date $Unique" }).Count -gt 0
  Add-Validation "Admin university" "Application deadline" "not-a-date" "422 rejected and not saved" "status=$($InvalidDate.status); saved=$DateSaved" "docs/testing-evidence/validation-results.json; database-verification.json" ($InvalidDate.status -eq 422 -and -not $DateSaved)
  $BadCoverage = Invoke-Api POST "/admin/scholarships" @{ name = "Bad Coverage $Unique"; provider = "SAA"; country = "Global"; coverage_type = "Banana"; amount = '$10'; application_deadline = "2027-09-15"; portal_url = "https://example.edu"; eligibility = "Demo" } $AdminHeaders
  $CoverageSaved = @((Load-Db).scholarships | Where-Object { $_.name -eq "Bad Coverage $Unique" }).Count -gt 0
  Add-Validation "Admin scholarship" "Coverage type" "Banana" "422 rejected and not saved" "status=$($BadCoverage.status); saved=$CoverageSaved" "docs/testing-evidence/validation-results.json; database-verification.json" ($BadCoverage.status -eq 422 -and -not $CoverageSaved)

  $AfterDb = Load-Db
  $AfterCounts = [PSCustomObject]@{
    users = $AfterDb.users.Count
    universities = $AfterDb.universities.Count
    scholarships = $AfterDb.scholarships.Count
    documents = $AfterDb.documents.Count
  }

  $Features | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $EvidenceDir "api-feature-results.json")
  $Validation | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $EvidenceDir "validation-results.json")
  [PSCustomObject]@{ before_counts = $BeforeCounts; after_counts = $AfterCounts; checks = $DbChecks } | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $EvidenceDir "database-verification.json")

  [PSCustomObject]@{
    feature_count = $Features.Count
    validation_count = $Validation.Count
    failed_features = @($Features | Where-Object { $_.status -eq "Failed" }).Count
    failed_validation = @($Validation | Where-Object { $_.status -eq "Failed" }).Count
    evidence_dir = $EvidenceDir
  } | ConvertTo-Json -Depth 5
} finally {
  if ($Frontend -and -not $Frontend.HasExited) { Stop-Process -Id $Frontend.Id -Force }
  if ($Backend -and -not $Backend.HasExited) { Stop-Process -Id $Backend.Id -Force }
}
