param(
  [string]$PhpExe = "D:\xamp\php\php.exe",
  [string]$ApiBase = "http://127.0.0.1:8000/api"
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$StartedServer = $false
$ServerProcess = $null
$Results = New-Object System.Collections.Generic.List[object]

function Add-Result {
  param(
    [string]$Area,
    [string]$Check,
    [bool]$Passed,
    [string]$Evidence = ""
  )

  $script:Results.Add([PSCustomObject]@{
    Area = $Area
    Check = $Check
    Passed = $Passed
    Evidence = $Evidence
  })

  if (-not $Passed) {
    throw "$Area - $Check failed. $Evidence"
  }
}

function Invoke-Json {
  param(
    [string]$Method = "GET",
    [string]$Path,
    [object]$Body = $null,
    [hashtable]$Headers = @{}
  )

  $options = @{
    Method = $Method
    Uri = "$ApiBase$Path"
    Headers = $Headers
  }

  if ($null -ne $Body) {
    $options.ContentType = "application/json"
    $options.Body = ($Body | ConvertTo-Json -Depth 12)
  }

  Invoke-RestMethod @options
}

function Wait-ForApi {
  for ($i = 0; $i -lt 20; $i++) {
    try {
      return Invoke-Json -Path ""
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }

  throw "API did not respond at $ApiBase"
}

try {
  try {
    $health = Invoke-Json -Path ""
  } catch {
    if (-not (Test-Path $PhpExe)) {
      throw "PHP executable not found at $PhpExe"
    }

    $ServerProcess = Start-Process -FilePath $PhpExe -ArgumentList @("-S", "127.0.0.1:8000", "router.php") -WorkingDirectory $Backend -WindowStyle Hidden -PassThru
    $StartedServer = $true
    $health = Wait-ForApi
  }

  Add-Result "Setup" "API health endpoint" ($health.success -eq $true) $health.message

  $origin = @{ Origin = "http://localhost:5173" }
  $unique = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  $newStudentEmail = "srs.student.$unique@test.com"

  $register = Invoke-Json -Method "POST" -Path "/auth/register" -Headers $origin -Body @{
    full_name = "SRS Acceptance Student"
    email = $newStudentEmail
    phone = "+92 300 5550000"
    password = "Test@12345!"
    password_confirmation = "Test@12345!"
  }
  Add-Result "Auth" "student registration" ($register.success -eq $true -and $register.data.user_id -gt 0) $newStudentEmail

  $studentLogin = Invoke-Json -Method "POST" -Path "/auth/login" -Headers $origin -Body @{
    email = "student@test.com"
    password = "Test@1234"
  }
  Add-Result "Auth" "student login" ($studentLogin.success -eq $true -and $studentLogin.data.token.Length -gt 20) $studentLogin.data.user.email

  $studentHeaders = @{
    Origin = "http://localhost:5173"
    Authorization = "Bearer $($studentLogin.data.token)"
  }

  $me = Invoke-Json -Path "/auth/me" -Headers $studentHeaders
  Add-Result "Auth" "current user" ($me.data.email -eq "student@test.com") $me.data.role

  $dashboard = Invoke-Json -Path "/student/dashboard" -Headers $studentHeaders
  Add-Result "Student" "dashboard summary" ($dashboard.success -eq $true -and $dashboard.data.profile_completion -ge 0) "profile=$($dashboard.data.profile_completion)"

  $profile = Invoke-Json -Path "/student/profile" -Headers $studentHeaders
  Add-Result "Student" "profile load" ($profile.data.email -eq "student@test.com") $profile.data.full_name

  $profileUpdate = Invoke-Json -Method "PUT" -Path "/student/profile" -Headers $studentHeaders -Body @{
    nationality = "Pakistan"
    current_country = "Pakistan"
    current_qualification = "Bachelor's Degree"
    gpa = 3.45
    field_of_interest = "Artificial Intelligence"
    degree_level = "Master"
    preferred_countries = @("Germany", "Canada", "United Kingdom")
    annual_budget_usd = 12000
    ielts_score = 7
    toefl_score = $null
    other_languages = "Urdu, Punjabi"
    needs_scholarship = $true
    target_intake = "Fall 2027"
    ranking_preference = "Top 500"
  }
  Add-Result "Student" "profile save" ($profileUpdate.success -eq $true -and $profileUpdate.data.degree_level -eq "Master") $profileUpdate.message

  $universities = Invoke-Json -Path "/recommendations/universities?country=Germany" -Headers $studentHeaders
  Add-Result "Recommendations" "university filter" ($universities.data.Count -ge 1) "Germany count=$($universities.data.Count)"

  $scholarships = Invoke-Json -Path "/recommendations/scholarships?coverage=Fully%20Funded" -Headers $studentHeaders
  Add-Result "Recommendations" "scholarship filter" ($scholarships.data.Count -ge 1) "Fully Funded count=$($scholarships.data.Count)"

  try {
    $shortlistAdd = Invoke-Json -Method "POST" -Path "/shortlist" -Headers $studentHeaders -Body @{
      entity_type = "university"
      entity_id = 10
    }
    Add-Result "Shortlist" "add university" ($shortlistAdd.success -eq $true) $shortlistAdd.message
  } catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
      Add-Result "Shortlist" "add university" $true "already present"
    } else {
      throw
    }
  }

  $shortlist = Invoke-Json -Path "/shortlist" -Headers $studentHeaders
  Add-Result "Shortlist" "list saved items" ($shortlist.success -eq $true -and $null -ne $shortlist.data.universities) "universities=$($shortlist.data.universities.Count)"

  $shortlistDelete = Invoke-Json -Method "DELETE" -Path "/shortlist/10?entity_type=university" -Headers $studentHeaders
  Add-Result "Shortlist" "remove university" ($shortlistDelete.success -eq $true) $shortlistDelete.message

  $guide = Invoke-Json -Path "/guides/university/1" -Headers $studentHeaders
  Add-Result "Guide" "how-to-apply guide" ($guide.success -eq $true -and $guide.data.required_documents.Count -gt 0) $guide.data.entity.name

  $roadmap = Invoke-Json -Path "/roadmap" -Headers $studentHeaders
  Add-Result "Roadmap" "load roadmap" ($roadmap.success -eq $true -and $roadmap.data.milestones.Count -gt 0) "milestones=$($roadmap.data.milestones.Count)"

  $milestoneId = $roadmap.data.milestones[0].id
  $milestone = Invoke-Json -Method "PATCH" -Path "/roadmap/milestones/$milestoneId" -Headers $studentHeaders -Body @{
    status = "Done"
  }
  Add-Result "Roadmap" "update milestone" ($milestone.success -eq $true) $milestone.message

  $templates = Invoke-Json -Path "/templates" -Headers $studentHeaders
  Add-Result "Templates" "list templates" ($templates.success -eq $true -and $templates.data.Count -ge 5) "templates=$($templates.data.Count)"

  $templateFile = Join-Path $env:TEMP "saa-template-$unique.pdf"
  Invoke-WebRequest -UseBasicParsing -Uri "$ApiBase/templates/1/download?format=pdf" -Headers $studentHeaders -OutFile $templateFile | Out-Null
  Add-Result "Templates" "download PDF template" ((Test-Path $templateFile) -and ((Get-Item $templateFile).Length -gt 100)) $templateFile
  Remove-Item -LiteralPath $templateFile -Force -ErrorAction SilentlyContinue

  $document = Invoke-Json -Method "POST" -Path "/writing/generate" -Headers $studentHeaders -Body @{
    document_type = "sop"
    target_university = "Technical University of Munich"
    target_program = "MSc Artificial Intelligence"
    achievements = "built an AI study planner and led a student project"
    background = "computer science graduate from Pakistan"
    word_limit = 500
  }
  Add-Result "Writing" "generate draft" ($document.success -eq $true -and $document.data.word_count -gt 20) "document=$($document.data.id)"

  $refined = Invoke-Json -Method "POST" -Path "/writing/$($document.data.id)/refine" -Headers $studentHeaders -Body @{
    instructions = "Make it more formal"
  }
  Add-Result "Writing" "refine draft" ($refined.success -eq $true -and $refined.data.word_count -ge $document.data.word_count) "words=$($refined.data.word_count)"

  $savedDocument = Invoke-Json -Method "PUT" -Path "/writing/$($document.data.id)" -Headers $studentHeaders -Body @{
    content = $refined.data.content
  }
  Add-Result "Writing" "save edited draft" ($savedDocument.success -eq $true) $savedDocument.message

  $adminLogin = Invoke-Json -Method "POST" -Path "/admin/auth/login" -Headers $origin -Body @{
    email = "admin@saa.local"
    password = "Admin@12345"
  }
  Add-Result "Admin" "admin login" ($adminLogin.success -eq $true -and $adminLogin.data.token.Length -gt 20) $adminLogin.data.user.email

  $adminHeaders = @{
    Origin = "http://localhost:5173"
    Authorization = "Bearer $($adminLogin.data.token)"
  }

  $adminDashboard = Invoke-Json -Path "/admin/dashboard" -Headers $adminHeaders
  Add-Result "Admin" "dashboard stats" ($adminDashboard.success -eq $true -and $adminDashboard.data.total_universities -ge 1) "students=$($adminDashboard.data.total_students)"

  $createdUniversity = Invoke-Json -Method "POST" -Path "/admin/universities" -Headers $adminHeaders -Body @{
    name = "SRS Test University $unique"
    country = "Germany"
    city = "Berlin"
    ranking = 999
    programs = @("MSc Test Program")
    tuition_fee_usd = 1000
    gpa_requirement = 2.5
    ielts_requirement = 6
    application_deadline = "2027-05-01"
    degree_levels = @("Master")
    website = "https://example.edu"
    description = "Temporary acceptance test university"
  }
  Add-Result "Admin" "create university" ($createdUniversity.success -eq $true) "id=$($createdUniversity.data.id)"

  $updatedUniversity = Invoke-Json -Method "PUT" -Path "/admin/universities/$($createdUniversity.data.id)" -Headers $adminHeaders -Body @{
    city = "Munich"
  }
  Add-Result "Admin" "update university" ($updatedUniversity.success -eq $true -and $updatedUniversity.data.city -eq "Munich") $updatedUniversity.message

  $deletedUniversity = Invoke-Json -Method "DELETE" -Path "/admin/universities/$($createdUniversity.data.id)" -Headers $adminHeaders
  Add-Result "Admin" "delete university" ($deletedUniversity.success -eq $true) $deletedUniversity.message

  $createdScholarship = Invoke-Json -Method "POST" -Path "/admin/scholarships" -Headers $adminHeaders -Body @{
    name = "SRS Test Scholarship $unique"
    provider = "SAA"
    funding_country = "Germany"
    coverage = "Partial Funding"
    eligible_nationalities = @("All")
    eligibility_summary = "Temporary acceptance test scholarship"
    degree_levels = @("Master")
    deadline = "2027-06-01"
    details = "Temporary details"
    link = "https://example.edu/scholarship"
  }
  Add-Result "Admin" "create scholarship" ($createdScholarship.success -eq $true) "id=$($createdScholarship.data.id)"

  $updatedScholarship = Invoke-Json -Method "PUT" -Path "/admin/scholarships/$($createdScholarship.data.id)" -Headers $adminHeaders -Body @{
    coverage = "Fully Funded"
  }
  Add-Result "Admin" "update scholarship" ($updatedScholarship.success -eq $true -and $updatedScholarship.data.coverage -eq "Fully Funded") $updatedScholarship.message

  $deletedScholarship = Invoke-Json -Method "DELETE" -Path "/admin/scholarships/$($createdScholarship.data.id)" -Headers $adminHeaders
  Add-Result "Admin" "delete scholarship" ($deletedScholarship.success -eq $true) $deletedScholarship.message

  $students = Invoke-Json -Path "/admin/students" -Headers $adminHeaders
  Add-Result "Admin" "list students" ($students.success -eq $true -and $students.data.Count -ge 1) "students=$($students.data.Count)"

  $newStudentId = $register.data.user_id
  $statusUpdate = Invoke-Json -Method "PATCH" -Path "/admin/students/$newStudentId/status" -Headers $adminHeaders -Body @{
    status = "inactive"
  }
  Add-Result "Admin" "update student status" ($statusUpdate.success -eq $true) $statusUpdate.message

  $deletedStudent = Invoke-Json -Method "DELETE" -Path "/admin/students/$newStudentId" -Headers $adminHeaders
  Add-Result "Admin" "delete test student" ($deletedStudent.success -eq $true) $deletedStudent.message

  Write-Host ""
  Write-Host "SRS acceptance smoke test passed." -ForegroundColor Green
  $Results | Format-Table -AutoSize
} finally {
  if ($StartedServer -and $ServerProcess -and -not $ServerProcess.HasExited) {
    Stop-Process -Id $ServerProcess.Id -Force
  }
}
