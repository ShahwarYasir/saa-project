<?php
declare(strict_types=1);

function saa_env(string $key, string $default = ''): string
{
    static $values = null;

    if ($values === null) {
        $values = [];
        $file = __DIR__ . '/../.env';
        if (is_file($file)) {
            foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                    continue;
                }
                [$name, $value] = explode('=', $line, 2);
                $values[trim($name)] = trim(trim($value), "\"'");
            }
        }
    }

    return $values[$key] ?? ($_ENV[$key] ?? $default);
}

function saa_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = saa_env('DB_HOST', '127.0.0.1');
    $port = saa_env('DB_PORT', '3306');
    $database = saa_env('DB_DATABASE', 'saa_project');
    $username = saa_env('DB_USERNAME', 'root');
    $password = saa_env('DB_PASSWORD', '');
    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function saa_mysql_statement(PDO $pdo, string $sql, array $params = []): PDOStatement
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    return $statement;
}

function saa_mysql_load_db(): array
{
    $pdo = saa_pdo();

    return [
        'users' => saa_mysql_load_users($pdo),
        'profiles' => saa_mysql_load_profiles($pdo),
        'universities' => saa_mysql_load_universities($pdo),
        'scholarships' => saa_mysql_load_scholarships($pdo),
        'shortlists' => saa_mysql_load_shortlists($pdo),
        'roadmap_milestones' => saa_mysql_load_roadmap_milestones($pdo),
        'documents' => saa_mysql_load_documents($pdo),
        'templates' => saa_mysql_load_templates($pdo),
    ];
}

function saa_mysql_load_users(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT id, full_name, email, phone, password_hash, role, status, DATE_FORMAT(registered_at, "%Y-%m-%d") AS registered_at FROM users ORDER BY id')->fetchAll();
    return array_map(fn (array $row): array => [
        'id' => (int) $row['id'],
        'full_name' => $row['full_name'],
        'email' => $row['email'],
        'phone' => $row['phone'] ?? '',
        'password_hash' => $row['password_hash'],
        'role' => $row['role'],
        'status' => $row['status'],
        'registered_at' => $row['registered_at'],
    ], $rows);
}

function saa_mysql_load_profiles(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT * FROM profiles ORDER BY user_id')->fetchAll();
    return array_map(fn (array $row): array => [
        'user_id' => (int) $row['user_id'],
        'nationality' => $row['nationality'] ?? '',
        'current_country' => $row['current_country'] ?? '',
        'current_qualification' => $row['current_qualification'] ?? '',
        'gpa' => saa_mysql_float_or_null($row['gpa']),
        'field_of_interest' => $row['field_of_interest'] ?? '',
        'degree_level' => $row['degree_level'] ?? '',
        'preferred_countries' => saa_mysql_decode_array($row['preferred_countries'] ?? '[]'),
        'annual_budget_usd' => saa_mysql_float_or_null($row['annual_budget_usd']),
        'ielts_score' => saa_mysql_float_or_null($row['ielts_score']),
        'toefl_score' => saa_mysql_float_or_null($row['toefl_score']),
        'other_languages' => $row['other_languages'] ?? '',
        'needs_scholarship' => (bool) $row['needs_scholarship'],
        'target_intake' => $row['target_intake'] ?? '',
        'ranking_preference' => $row['ranking_preference'] ?? '',
    ], $rows);
}

function saa_mysql_load_universities(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT * FROM universities ORDER BY id')->fetchAll();
    return array_map(fn (array $row): array => [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'country' => $row['country'],
        'city' => $row['city'] ?? '',
        'ranking' => saa_mysql_int_or_null($row['ranking']),
        'programs' => saa_mysql_decode_array($row['programs'] ?? '[]'),
        'tuition_fee_usd' => saa_mysql_float_or_null($row['tuition_fee_usd']) ?? 0,
        'gpa_requirement' => saa_mysql_float_or_null($row['gpa_requirement']),
        'ielts_requirement' => saa_mysql_float_or_null($row['ielts_requirement']),
        'application_deadline' => $row['application_deadline'] ?? '',
        'degree_levels' => saa_mysql_decode_array($row['degree_levels'] ?? '[]'),
        'match_score' => saa_mysql_int_or_null($row['match_score']),
        'website' => $row['website'] ?? '',
        'portal_url' => $row['portal_url'] ?? '',
        'description' => $row['description'] ?? '',
    ], $rows);
}

function saa_mysql_load_scholarships(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT * FROM scholarships ORDER BY id')->fetchAll();
    return array_map(fn (array $row): array => [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'provider' => $row['provider'],
        'funding_country' => $row['funding_country'] ?? '',
        'country' => $row['country'] ?? '',
        'coverage' => $row['coverage'] ?? '',
        'coverage_type' => $row['coverage_type'] ?? '',
        'amount' => $row['amount'] ?? '',
        'eligible_nationalities' => saa_mysql_decode_array($row['eligible_nationalities'] ?? '[]'),
        'eligibility_summary' => $row['eligibility_summary'] ?? '',
        'eligibility' => $row['eligibility'] ?? '',
        'degree_levels' => saa_mysql_decode_array($row['degree_levels'] ?? '[]'),
        'deadline' => $row['deadline'] ?? '',
        'application_deadline' => $row['application_deadline'] ?? '',
        'details' => $row['details'] ?? '',
        'link' => $row['link'] ?? '',
        'portal_url' => $row['portal_url'] ?? '',
    ], $rows);
}

function saa_mysql_load_shortlists(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT id, user_id, entity_type, entity_id, created_at FROM shortlists ORDER BY id')->fetchAll();
    return array_map(fn (array $row): array => [
        'id' => (int) $row['id'],
        'user_id' => (int) $row['user_id'],
        'entity_type' => $row['entity_type'],
        'entity_id' => (int) $row['entity_id'],
        'created_at' => saa_mysql_to_iso($row['created_at']),
    ], $rows);
}

function saa_mysql_load_roadmap_milestones(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT id, user_id, title, description, suggested_date, deadline, status, display_order FROM roadmap_milestones ORDER BY user_id, display_order, id')->fetchAll();
    return array_map(fn (array $row): array => [
        'id' => (int) $row['id'],
        'user_id' => (int) $row['user_id'],
        'title' => $row['title'],
        'description' => $row['description'] ?? '',
        'suggested_date' => $row['suggested_date'] ?? '',
        'deadline' => $row['deadline'] ?? '',
        'status' => $row['status'],
        'order' => (int) $row['display_order'],
    ], $rows);
}

function saa_mysql_load_documents(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT id, user_id, document_type, content, word_count, created_at, updated_at FROM documents ORDER BY id')->fetchAll();
    return array_map(fn (array $row): array => [
        'id' => (int) $row['id'],
        'user_id' => (int) $row['user_id'],
        'document_type' => $row['document_type'],
        'content' => $row['content'],
        'word_count' => (int) $row['word_count'],
        'created_at' => saa_mysql_to_iso($row['created_at']),
        'updated_at' => saa_mysql_to_iso($row['updated_at']),
    ], $rows);
}

function saa_mysql_load_templates(PDO $pdo): array
{
    $rows = saa_mysql_statement($pdo, 'SELECT id, name, description, category, formats FROM templates ORDER BY id')->fetchAll();
    return array_map(fn (array $row): array => [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'description' => $row['description'] ?? '',
        'category' => $row['category'] ?? '',
        'format' => saa_mysql_decode_array($row['formats'] ?? '[]'),
    ], $rows);
}

function saa_mysql_replace_db(array $db): void
{
    $pdo = saa_pdo();
    $pdo->beginTransaction();

    try {
        foreach (['documents', 'roadmap_milestones', 'shortlists', 'profiles', 'users', 'universities', 'scholarships', 'templates'] as $table) {
            saa_mysql_statement($pdo, "DELETE FROM {$table}");
        }

        $userInsert = $pdo->prepare('INSERT INTO users (id, full_name, email, phone, password_hash, role, status, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        foreach ($db['users'] ?? [] as $user) {
            $userInsert->execute([
                (int) $user['id'],
                (string) ($user['full_name'] ?? ''),
                strtolower(trim((string) ($user['email'] ?? ''))),
                (string) ($user['phone'] ?? ''),
                (string) ($user['password_hash'] ?? ''),
                (string) ($user['role'] ?? 'student'),
                (string) ($user['status'] ?? 'active'),
                saa_mysql_date_param($user['registered_at'] ?? null),
            ]);
        }

        $profileInsert = $pdo->prepare('INSERT INTO profiles (user_id, nationality, current_country, current_qualification, gpa, field_of_interest, degree_level, preferred_countries, annual_budget_usd, ielts_score, toefl_score, other_languages, needs_scholarship, target_intake, ranking_preference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        foreach ($db['profiles'] ?? [] as $profile) {
            $profileInsert->execute([
                (int) $profile['user_id'],
                (string) ($profile['nationality'] ?? ''),
                (string) ($profile['current_country'] ?? ''),
                (string) ($profile['current_qualification'] ?? ''),
                saa_mysql_float_or_null($profile['gpa'] ?? null),
                (string) ($profile['field_of_interest'] ?? ''),
                (string) ($profile['degree_level'] ?? ''),
                saa_mysql_encode_array($profile['preferred_countries'] ?? []),
                saa_mysql_float_or_null($profile['annual_budget_usd'] ?? null),
                saa_mysql_float_or_null($profile['ielts_score'] ?? null),
                saa_mysql_float_or_null($profile['toefl_score'] ?? null),
                (string) ($profile['other_languages'] ?? ''),
                !empty($profile['needs_scholarship']) ? 1 : 0,
                (string) ($profile['target_intake'] ?? ''),
                (string) ($profile['ranking_preference'] ?? ''),
            ]);
        }

        $universityInsert = $pdo->prepare('INSERT INTO universities (id, name, country, city, ranking, programs, tuition_fee_usd, gpa_requirement, ielts_requirement, application_deadline, degree_levels, match_score, website, portal_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        foreach ($db['universities'] ?? [] as $university) {
            $universityInsert->execute([
                (int) $university['id'],
                (string) ($university['name'] ?? ''),
                (string) ($university['country'] ?? ''),
                (string) ($university['city'] ?? ''),
                saa_mysql_int_or_null($university['ranking'] ?? null),
                saa_mysql_encode_array($university['programs'] ?? []),
                saa_mysql_float_or_null($university['tuition_fee_usd'] ?? 0) ?? 0,
                saa_mysql_float_or_null($university['gpa_requirement'] ?? null),
                saa_mysql_float_or_null($university['ielts_requirement'] ?? null),
                saa_mysql_date_or_null($university['application_deadline'] ?? null),
                saa_mysql_encode_array($university['degree_levels'] ?? []),
                saa_mysql_int_or_null($university['match_score'] ?? null),
                (string) ($university['website'] ?? ''),
                (string) ($university['portal_url'] ?? ''),
                (string) ($university['description'] ?? ''),
            ]);
        }

        $scholarshipInsert = $pdo->prepare('INSERT INTO scholarships (id, name, provider, funding_country, country, coverage, coverage_type, amount, eligible_nationalities, eligibility_summary, eligibility, degree_levels, deadline, application_deadline, details, link, portal_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        foreach ($db['scholarships'] ?? [] as $scholarship) {
            $scholarshipInsert->execute([
                (int) $scholarship['id'],
                (string) ($scholarship['name'] ?? ''),
                (string) ($scholarship['provider'] ?? ''),
                (string) ($scholarship['funding_country'] ?? ''),
                (string) ($scholarship['country'] ?? ($scholarship['funding_country'] ?? '')),
                (string) ($scholarship['coverage'] ?? ''),
                (string) ($scholarship['coverage_type'] ?? ''),
                (string) ($scholarship['amount'] ?? ''),
                saa_mysql_encode_array($scholarship['eligible_nationalities'] ?? []),
                (string) ($scholarship['eligibility_summary'] ?? ''),
                (string) ($scholarship['eligibility'] ?? ($scholarship['eligibility_summary'] ?? '')),
                saa_mysql_encode_array($scholarship['degree_levels'] ?? []),
                saa_mysql_date_or_null($scholarship['deadline'] ?? null),
                saa_mysql_date_or_null($scholarship['application_deadline'] ?? ($scholarship['deadline'] ?? null)),
                (string) ($scholarship['details'] ?? ''),
                (string) ($scholarship['link'] ?? ''),
                (string) ($scholarship['portal_url'] ?? ($scholarship['link'] ?? '')),
            ]);
        }

        $shortlistInsert = $pdo->prepare('INSERT INTO shortlists (id, user_id, entity_type, entity_id, created_at) VALUES (?, ?, ?, ?, ?)');
        foreach ($db['shortlists'] ?? [] as $shortlist) {
            $shortlistInsert->execute([
                (int) $shortlist['id'],
                (int) $shortlist['user_id'],
                (string) $shortlist['entity_type'],
                (int) $shortlist['entity_id'],
                saa_mysql_datetime_param($shortlist['created_at'] ?? null),
            ]);
        }

        $milestoneInsert = $pdo->prepare('INSERT INTO roadmap_milestones (id, user_id, title, description, suggested_date, deadline, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        foreach ($db['roadmap_milestones'] ?? [] as $milestone) {
            $milestoneInsert->execute([
                (int) $milestone['id'],
                (int) $milestone['user_id'],
                (string) ($milestone['title'] ?? ''),
                (string) ($milestone['description'] ?? ''),
                saa_mysql_date_or_null($milestone['suggested_date'] ?? null),
                saa_mysql_date_or_null($milestone['deadline'] ?? null),
                (string) ($milestone['status'] ?? 'Not Started'),
                (int) ($milestone['order'] ?? 0),
            ]);
        }

        $documentInsert = $pdo->prepare('INSERT INTO documents (id, user_id, document_type, content, word_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
        foreach ($db['documents'] ?? [] as $document) {
            $documentInsert->execute([
                (int) $document['id'],
                (int) $document['user_id'],
                (string) ($document['document_type'] ?? ''),
                (string) ($document['content'] ?? ''),
                (int) ($document['word_count'] ?? 0),
                saa_mysql_datetime_param($document['created_at'] ?? null),
                saa_mysql_datetime_param($document['updated_at'] ?? ($document['created_at'] ?? null)),
            ]);
        }

        $templateInsert = $pdo->prepare('INSERT INTO templates (id, name, description, category, formats) VALUES (?, ?, ?, ?, ?)');
        foreach ($db['templates'] ?? [] as $template) {
            $templateInsert->execute([
                (int) $template['id'],
                (string) ($template['name'] ?? ''),
                (string) ($template['description'] ?? ''),
                (string) ($template['category'] ?? ''),
                saa_mysql_encode_array($template['format'] ?? ($template['formats'] ?? [])),
            ]);
        }

        $pdo->commit();
    } catch (Throwable $exception) {
        $pdo->rollBack();
        throw $exception;
    }
}

function saa_mysql_counts(): array
{
    $pdo = saa_pdo();
    $tables = ['users', 'profiles', 'universities', 'scholarships', 'shortlists', 'roadmap_milestones', 'documents', 'templates'];
    $counts = [];
    foreach ($tables as $table) {
        $row = saa_mysql_statement($pdo, "SELECT COUNT(*) AS total FROM {$table}")->fetch();
        $counts[$table] = (int) ($row['total'] ?? 0);
    }
    return $counts;
}

function saa_mysql_decode_array(mixed $value): array
{
    if (is_array($value)) {
        return array_values($value);
    }
    if ($value === null || $value === '') {
        return [];
    }
    $decoded = json_decode((string) $value, true);
    return is_array($decoded) ? array_values($decoded) : [];
}

function saa_mysql_encode_array(mixed $value): string
{
    $array = is_array($value) ? array_values($value) : [];
    return json_encode($array, JSON_UNESCAPED_SLASHES) ?: '[]';
}

function saa_mysql_float_or_null(mixed $value): ?float
{
    return $value === null || $value === '' ? null : (float) $value;
}

function saa_mysql_int_or_null(mixed $value): ?int
{
    return $value === null || $value === '' ? null : (int) $value;
}

function saa_mysql_date_or_null(mixed $value): ?string
{
    if ($value === null || trim((string) $value) === '') {
        return null;
    }
    $timestamp = strtotime((string) $value);
    return $timestamp === false ? null : gmdate('Y-m-d', $timestamp);
}

function saa_mysql_date_param(mixed $value): string
{
    return saa_mysql_date_or_null($value) ?? gmdate('Y-m-d');
}

function saa_mysql_datetime_param(mixed $value): string
{
    if ($value === null || trim((string) $value) === '') {
        return gmdate('Y-m-d H:i:s');
    }
    $timestamp = strtotime((string) $value);
    return $timestamp === false ? gmdate('Y-m-d H:i:s') : gmdate('Y-m-d H:i:s', $timestamp);
}

function saa_mysql_to_iso(mixed $value): string
{
    if ($value === null || trim((string) $value) === '') {
        return gmdate('c');
    }
    $timestamp = strtotime((string) $value);
    return $timestamp === false ? gmdate('c') : gmdate('c', $timestamp);
}
