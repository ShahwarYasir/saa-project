<?php
declare(strict_types=1);

const SAA_DATA_FILE = __DIR__ . '/../data/database.json';

function saa_run(): void
{
    saa_send_cors_headers();

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        return;
    }

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $db = saa_load_db();

    try {
        saa_dispatch($method, $path, $db);
    } catch (Throwable $exception) {
        saa_json([
            'success' => false,
            'message' => 'Server error',
            'errors' => ['server' => [$exception->getMessage()]],
        ], 500);
    }
}

function saa_dispatch(string $method, string $path, array $db): void
{
    if ($path === '/' || $path === '/api') {
        saa_json([
            'success' => true,
            'message' => 'Study Abroad Assistant API is running',
            'data' => [
                'name' => 'SAA Simple PHP API',
                'version' => '1.0.0',
            ],
        ]);
        return;
    }

    if ($method === 'POST' && $path === '/api/auth/register') {
        saa_auth_register($db);
        return;
    }

    if ($method === 'POST' && $path === '/api/auth/login') {
        saa_auth_login($db, 'student');
        return;
    }

    if ($method === 'POST' && ($path === '/api/admin/auth/login' || $path === '/api/auth/admin/login')) {
        saa_auth_login($db, 'admin');
        return;
    }

    if ($method === 'GET' && $path === '/api/auth/me') {
        $user = saa_require_auth($db);
        saa_json(['success' => true, 'data' => saa_public_user($user)]);
        return;
    }

    if ($method === 'POST' && $path === '/api/auth/logout') {
        saa_require_auth($db);
        saa_json(['success' => true, 'message' => 'Logged out successfully']);
        return;
    }

    if ($method === 'GET' && $path === '/api/student/dashboard') {
        $user = saa_require_auth($db, 'student');
        saa_student_dashboard($db, $user);
        return;
    }

    if ($method === 'GET' && $path === '/api/student/profile') {
        $user = saa_require_auth($db, 'student');
        saa_json(['success' => true, 'data' => saa_profile_for_user($db, $user)]);
        return;
    }

    if ($method === 'PUT' && $path === '/api/student/profile') {
        $user = saa_require_auth($db, 'student');
        saa_update_profile($db, $user);
        return;
    }

    if ($method === 'GET' && $path === '/api/recommendations/universities') {
        $user = saa_require_auth($db, 'student');
        saa_university_recommendations($db, $user);
        return;
    }

    if ($method === 'GET' && $path === '/api/recommendations/scholarships') {
        $user = saa_require_auth($db, 'student');
        saa_scholarship_recommendations($db, $user);
        return;
    }

    if ($method === 'GET' && $path === '/api/shortlist') {
        $user = saa_require_auth($db, 'student');
        saa_shortlist_index($db, $user);
        return;
    }

    if ($method === 'POST' && $path === '/api/shortlist') {
        $user = saa_require_auth($db, 'student');
        saa_shortlist_store($db, $user);
        return;
    }

    if ($method === 'DELETE' && preg_match('#^/api/shortlist/(\d+)$#', $path, $matches)) {
        $user = saa_require_auth($db, 'student');
        saa_shortlist_delete($db, $user, (int) $matches[1]);
        return;
    }

    if ($method === 'GET' && preg_match('#^/api/guides/(university|scholarship)/(\d+)$#', $path, $matches)) {
        saa_require_auth($db, 'student');
        saa_application_guide($db, $matches[1], (int) $matches[2]);
        return;
    }

    if ($method === 'GET' && $path === '/api/roadmap') {
        $user = saa_require_auth($db, 'student');
        saa_roadmap_index($db, $user);
        return;
    }

    if ($method === 'POST' && $path === '/api/roadmap/generate') {
        $user = saa_require_auth($db, 'student');
        saa_roadmap_generate($db, $user);
        return;
    }

    if ($method === 'PATCH' && preg_match('#^/api/roadmap/milestones/(\d+)$#', $path, $matches)) {
        $user = saa_require_auth($db, 'student');
        saa_roadmap_update_milestone($db, $user, (int) $matches[1]);
        return;
    }

    if ($method === 'GET' && $path === '/api/templates') {
        saa_require_auth($db, 'student');
        saa_json(['success' => true, 'data' => array_values($db['templates'])]);
        return;
    }

    if ($method === 'GET' && preg_match('#^/api/templates/(\d+)/download$#', $path, $matches)) {
        saa_require_auth($db, 'student');
        saa_template_download($db, (int) $matches[1]);
        return;
    }

    if ($method === 'POST' && $path === '/api/writing/generate') {
        $user = saa_require_auth($db, 'student');
        saa_writing_generate($db, $user);
        return;
    }

    if ($method === 'PUT' && preg_match('#^/api/writing/(\d+)$#', $path, $matches)) {
        $user = saa_require_auth($db, 'student');
        saa_writing_update($db, $user, (int) $matches[1]);
        return;
    }

    if ($method === 'POST' && preg_match('#^/api/writing/(\d+)/refine$#', $path, $matches)) {
        $user = saa_require_auth($db, 'student');
        saa_writing_refine($db, $user, (int) $matches[1]);
        return;
    }

    if ($method === 'GET' && $path === '/api/admin/dashboard') {
        saa_require_auth($db, 'admin');
        saa_admin_dashboard($db);
        return;
    }

    if ($method === 'GET' && $path === '/api/admin/universities') {
        saa_require_auth($db, 'admin');
        saa_json(['success' => true, 'data' => array_map('saa_university_response', array_values($db['universities']))]);
        return;
    }

    if ($method === 'POST' && $path === '/api/admin/universities') {
        saa_require_auth($db, 'admin');
        saa_admin_create_university($db);
        return;
    }

    if ($method === 'PUT' && preg_match('#^/api/admin/universities/(\d+)$#', $path, $matches)) {
        saa_require_auth($db, 'admin');
        saa_admin_update_university($db, (int) $matches[1]);
        return;
    }

    if ($method === 'DELETE' && preg_match('#^/api/admin/universities/(\d+)$#', $path, $matches)) {
        saa_require_auth($db, 'admin');
        saa_admin_delete_entity($db, 'universities', 'university', (int) $matches[1]);
        return;
    }

    if ($method === 'GET' && $path === '/api/admin/scholarships') {
        saa_require_auth($db, 'admin');
        saa_json(['success' => true, 'data' => array_map('saa_scholarship_response', array_values($db['scholarships']))]);
        return;
    }

    if ($method === 'POST' && $path === '/api/admin/scholarships') {
        saa_require_auth($db, 'admin');
        saa_admin_create_scholarship($db);
        return;
    }

    if ($method === 'PUT' && preg_match('#^/api/admin/scholarships/(\d+)$#', $path, $matches)) {
        saa_require_auth($db, 'admin');
        saa_admin_update_scholarship($db, (int) $matches[1]);
        return;
    }

    if ($method === 'DELETE' && preg_match('#^/api/admin/scholarships/(\d+)$#', $path, $matches)) {
        saa_require_auth($db, 'admin');
        saa_admin_delete_entity($db, 'scholarships', 'scholarship', (int) $matches[1]);
        return;
    }

    if ($method === 'GET' && $path === '/api/admin/students') {
        saa_require_auth($db, 'admin');
        saa_admin_students($db);
        return;
    }

    if ($method === 'PATCH' && preg_match('#^/api/admin/students/(\d+)/status$#', $path, $matches)) {
        saa_require_auth($db, 'admin');
        saa_admin_update_student_status($db, (int) $matches[1]);
        return;
    }

    if ($method === 'DELETE' && preg_match('#^/api/admin/students/(\d+)$#', $path, $matches)) {
        saa_require_auth($db, 'admin');
        saa_admin_delete_student($db, (int) $matches[1]);
        return;
    }

    saa_json(['success' => false, 'message' => 'Endpoint not found', 'errors' => []], 404);
}

function saa_send_cors_headers(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = array_filter(array_map('trim', explode(',', saa_env('FRONTEND_URL', 'http://localhost:5173,http://127.0.0.1:5173'))));
    $isLocalDevOrigin = (bool) preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin);

    if ($origin !== '' && (in_array($origin, $allowed, true) || $isLocalDevOrigin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: http://localhost:5173');
    }

    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Expose-Headers: Content-Disposition');
    header('Access-Control-Max-Age: 86400');
}

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

function saa_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
}

function saa_error(string $message, int $status = 400, array $errors = []): void
{
    saa_json([
        'success' => false,
        'message' => $message,
        'errors' => $errors,
    ], $status);
}

function saa_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function saa_load_db(): array
{
    if (!is_file(SAA_DATA_FILE)) {
        $db = saa_seed_db();
        saa_save_db($db);
        return $db;
    }

    $content = file_get_contents(SAA_DATA_FILE);
    $decoded = $content ? json_decode($content, true) : null;
    if (!is_array($decoded)) {
        return saa_seed_db();
    }

    [$db, $changed] = saa_ensure_demo_data($decoded);
    if ($changed) {
        saa_save_db($db);
    }
    return $db;
}

function saa_save_db(array $db): void
{
    $dir = dirname(SAA_DATA_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    file_put_contents(SAA_DATA_FILE, json_encode($db, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function saa_next_id(array $items): int
{
    $max = 0;
    foreach ($items as $item) {
        $max = max($max, (int) ($item['id'] ?? 0));
    }
    return $max + 1;
}

function saa_find_index_by_id(array $items, int $id): ?int
{
    foreach ($items as $index => $item) {
        if ((int) ($item['id'] ?? 0) === $id) {
            return $index;
        }
    }
    return null;
}

function saa_find_user_by_email(array $db, string $email, ?string $role = null): ?array
{
    $email = strtolower(trim($email));
    foreach ($db['users'] as $user) {
        if (strtolower((string) $user['email']) === $email && ($role === null || $user['role'] === $role)) {
            return $user;
        }
    }
    return null;
}

function saa_public_user(array $user): array
{
    return [
        'id' => (int) $user['id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'] ?? '',
        'role' => $user['role'],
        'status' => $user['status'] ?? 'active',
    ];
}

function saa_auth_register(array $db): void
{
    $input = saa_input();
    $errors = [];
    $fullName = trim((string) ($input['full_name'] ?? ''));
    $phone = trim((string) ($input['phone'] ?? ''));

    if (strlen($fullName) < 2) {
        $errors['full_name'][] = 'Full name must be at least 2 characters.';
    } elseif (strlen($fullName) > 120) {
        $errors['full_name'][] = 'Full name must not exceed 120 characters.';
    } elseif (saa_contains_unsafe_text($fullName)) {
        $errors['full_name'][] = 'Full name contains unsupported characters.';
    }
    if (!filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
        $errors['email'][] = 'Enter a valid email address.';
    } elseif (saa_find_user_by_email($db, (string) $input['email']) !== null) {
        $errors['email'][] = 'The email has already been taken.';
    }
    if (strlen($phone) < 7) {
        $errors['phone'][] = 'Phone number must be at least 7 characters.';
    } elseif (strlen($phone) > 30 || !preg_match('/^[0-9+()\-\s]+$/', $phone)) {
        $errors['phone'][] = 'Phone number format is invalid.';
    }

    $password = (string) ($input['password'] ?? '');
    if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[^A-Za-z0-9]/', $password)) {
        $errors['password'][] = 'Password must be at least 8 characters and include uppercase, number, and special character.';
    }
    if ($password !== (string) ($input['password_confirmation'] ?? '')) {
        $errors['password_confirmation'][] = 'Passwords must match.';
    }

    if ($errors !== []) {
        saa_error('Validation failed', 422, $errors);
        return;
    }

    $userId = saa_next_id($db['users']);
    $db['users'][] = [
        'id' => $userId,
        'full_name' => $fullName,
        'email' => strtolower(trim((string) $input['email'])),
        'phone' => $phone,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'role' => 'student',
        'status' => 'active',
        'registered_at' => gmdate('Y-m-d'),
    ];

    $db['profiles'][] = [
        'user_id' => $userId,
        'preferred_countries' => [],
        'needs_scholarship' => false,
    ];

    saa_save_db($db);
    saa_json([
        'success' => true,
        'message' => 'Account created successfully. Please login.',
        'data' => ['user_id' => $userId],
    ], 201);
}

function saa_auth_login(array $db, string $role): void
{
    $input = saa_input();
    $user = saa_find_user_by_email($db, (string) ($input['email'] ?? ''), $role);
    $passwordOk = $user !== null && password_verify((string) ($input['password'] ?? ''), (string) $user['password_hash']);
    $active = $user !== null && ($user['status'] ?? 'active') === 'active';

    if (!$passwordOk || !$active) {
        saa_error($role === 'admin' ? 'Invalid admin credentials' : 'Invalid email or password', 401);
        return;
    }

    saa_json([
        'success' => true,
        'message' => $role === 'admin' ? 'Admin login successful' : 'Login successful',
        'data' => [
            'token' => saa_create_token($user),
            'user' => saa_public_user($user),
        ],
    ]);
}

function saa_create_token(array $user): string
{
    $header = saa_base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']) ?: '{}');
    $payload = saa_base64url_encode(json_encode([
        'sub' => (int) $user['id'],
        'role' => $user['role'],
        'email' => $user['email'],
        'iat' => time(),
        'exp' => time() + ((int) saa_env('JWT_TTL_MINUTES', '120') * 60),
    ]) ?: '{}');
    $signature = saa_base64url_encode(hash_hmac('sha256', $header . '.' . $payload, saa_jwt_secret(), true));

    return $header . '.' . $payload . '.' . $signature;
}

function saa_decode_token(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$header, $payload, $signature] = $parts;
    $expected = saa_base64url_encode(hash_hmac('sha256', $header . '.' . $payload, saa_jwt_secret(), true));
    if (!hash_equals($expected, $signature)) {
        return null;
    }

    $decoded = json_decode(saa_base64url_decode($payload), true);
    if (!is_array($decoded) || (int) ($decoded['exp'] ?? 0) < time()) {
        return null;
    }

    return $decoded;
}

function saa_jwt_secret(): string
{
    return saa_env('JWT_SECRET', 'change_this_to_a_long_random_secret_for_local_demo');
}

function saa_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function saa_base64url_decode(string $value): string
{
    return base64_decode(strtr($value . str_repeat('=', (4 - strlen($value) % 4) % 4), '-_', '+/')) ?: '';
}

function saa_bearer_token(): ?string
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? ($headers['Authorization'] ?? $headers['authorization'] ?? '');

    if (preg_match('/Bearer\s+(.+)/i', $authorization, $matches)) {
        return trim($matches[1]);
    }

    return null;
}

function saa_require_auth(array $db, ?string $role = null): array
{
    $token = saa_bearer_token();
    $payload = $token ? saa_decode_token($token) : null;
    if ($payload === null) {
        saa_error('Unauthenticated', 401);
        exit;
    }

    $user = null;
    foreach ($db['users'] as $candidate) {
        if ((int) $candidate['id'] === (int) ($payload['sub'] ?? 0)) {
            $user = $candidate;
            break;
        }
    }

    if ($user === null || ($user['status'] ?? 'active') !== 'active') {
        saa_error('Unauthenticated', 401);
        exit;
    }

    if ($role !== null && $user['role'] !== $role) {
        saa_error('Forbidden', 403);
        exit;
    }

    return $user;
}

function saa_profile_for_user(array $db, array $user): array
{
    $profile = [
        'nationality' => '',
        'current_country' => '',
        'current_qualification' => '',
        'gpa' => null,
        'field_of_interest' => '',
        'degree_level' => '',
        'preferred_countries' => [],
        'annual_budget_usd' => null,
        'ielts_score' => null,
        'toefl_score' => null,
        'other_languages' => '',
        'needs_scholarship' => false,
        'target_intake' => '',
        'ranking_preference' => '',
    ];

    foreach ($db['profiles'] as $row) {
        if ((int) ($row['user_id'] ?? 0) === (int) $user['id']) {
            $profile = array_merge($profile, $row);
            break;
        }
    }

    unset($profile['user_id']);

    return array_merge([
        'id' => (int) $user['id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'] ?? '',
    ], $profile);
}

function saa_update_profile(array $db, array $user): void
{
    $input = saa_input();
    $errors = saa_validate_profile_input($input);
    if ($errors !== []) {
        saa_error('Validation failed', 422, $errors);
        return;
    }

    $allowed = [
        'nationality',
        'current_country',
        'current_qualification',
        'gpa',
        'field_of_interest',
        'degree_level',
        'preferred_countries',
        'annual_budget_usd',
        'ielts_score',
        'toefl_score',
        'other_languages',
        'needs_scholarship',
        'target_intake',
        'ranking_preference',
    ];

    $profile = ['user_id' => (int) $user['id']];
    foreach ($allowed as $key) {
        if (array_key_exists($key, $input)) {
            $profile[$key] = saa_normalize_profile_value($key, $input[$key]);
        }
    }

    $found = false;
    foreach ($db['profiles'] as $index => $row) {
        if ((int) ($row['user_id'] ?? 0) === (int) $user['id']) {
            $db['profiles'][$index] = array_merge($row, $profile);
            $found = true;
            break;
        }
    }

    if (!$found) {
        $db['profiles'][] = $profile;
    }

    saa_save_db($db);
    saa_json([
        'success' => true,
        'message' => 'Profile updated successfully',
        'data' => saa_profile_for_user($db, $user),
    ]);
}

function saa_normalize_profile_value(string $key, mixed $value): mixed
{
    if ($key === 'preferred_countries') {
        return saa_array_value($value);
    }
    if ($key === 'needs_scholarship') {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
    if (in_array($key, ['gpa', 'annual_budget_usd', 'ielts_score', 'toefl_score'], true)) {
        return $value === '' || $value === null ? null : (float) $value;
    }
    return is_string($value) ? trim($value) : $value;
}

function saa_profile_completion(array $profile): int
{
    $fields = [
        'nationality',
        'current_country',
        'current_qualification',
        'gpa',
        'field_of_interest',
        'degree_level',
        'preferred_countries',
        'annual_budget_usd',
        'ielts_score',
        'target_intake',
    ];

    $completed = 0;
    foreach ($fields as $field) {
        $value = $profile[$field] ?? null;
        if (is_array($value) ? count($value) > 0 : ($value !== null && $value !== '')) {
            $completed++;
        }
    }

    return (int) round(($completed / count($fields)) * 100);
}

function saa_student_dashboard(array $db, array $user): void
{
    $profile = saa_profile_for_user($db, $user);
    $milestones = saa_user_milestones($db, (int) $user['id']);
    $done = count(array_filter($milestones, fn (array $item): bool => ($item['status'] ?? '') === 'Done'));
    $roadmapProgress = count($milestones) > 0 ? (int) round(($done / count($milestones)) * 100) : 0;

    saa_json([
        'success' => true,
        'data' => [
            'saved_universities' => count(saa_shortlisted_ids($db, (int) $user['id'], 'university')),
            'saved_scholarships' => count(saa_shortlisted_ids($db, (int) $user['id'], 'scholarship')),
            'profile_completion' => saa_profile_completion($profile),
            'roadmap_progress' => $roadmapProgress,
            'recent_activity' => saa_recent_activity($db, (int) $user['id']),
        ],
    ]);
}

function saa_recent_activity(array $db, int $userId): array
{
    $activities = [];
    foreach ($db['shortlists'] as $row) {
        if ((int) $row['user_id'] === $userId) {
            $entity = saa_entity_by_id($db, $row['entity_type'], (int) $row['entity_id']);
            if ($entity !== null) {
                $activities[] = [
                    'id' => count($activities) + 1,
                    'action' => 'Saved ' . $entity['name'] . ' to shortlist',
                    'time' => 'Recently',
                    'icon' => 'bi-bookmark-fill',
                ];
            }
        }
    }

    foreach ($db['documents'] as $document) {
        if ((int) $document['user_id'] === $userId) {
            $activities[] = [
                'id' => count($activities) + 1,
                'action' => 'Generated ' . str_replace('_', ' ', (string) $document['document_type']) . ' draft',
                'time' => 'Recently',
                'icon' => 'bi-file-text-fill',
            ];
        }
    }

    return array_slice(array_reverse($activities), 0, 5);
}

function saa_university_recommendations(array $db, array $user): void
{
    $items = array_values($db['universities']);
    $query = $_GET;
    $profile = saa_profile_for_user($db, $user);
    $shortlisted = saa_shortlisted_ids($db, (int) $user['id'], 'university');

    $items = array_filter($items, function (array $item) use ($query): bool {
        if (!empty($query['country']) && $item['country'] !== $query['country']) {
            return false;
        }
        if (!empty($query['degree_level']) && !in_array($query['degree_level'], $item['degree_levels'] ?? [], true)) {
            return false;
        }
        if (!empty($query['max_tuition']) && (float) $item['tuition_fee_usd'] > (float) $query['max_tuition']) {
            return false;
        }
        if (!empty($query['min_gpa']) && (float) $item['gpa_requirement'] > (float) $query['min_gpa']) {
            return false;
        }
        if (!empty($query['program'])) {
            $programQuery = strtolower((string) $query['program']);
            $matches = false;
            foreach ($item['programs'] ?? [] as $program) {
                if (str_contains(strtolower((string) $program), $programQuery)) {
                    $matches = true;
                    break;
                }
            }
            if (!$matches) {
                return false;
            }
        }
        return true;
    });

    $items = array_map(function (array $item) use ($profile, $shortlisted): array {
        $item['match_score'] = saa_calculate_university_match($item, $profile);
        $item['is_shortlisted'] = in_array((int) $item['id'], $shortlisted, true);
        return saa_university_response($item);
    }, array_values($items));

    usort($items, fn (array $a, array $b): int => ($b['match_score'] ?? 0) <=> ($a['match_score'] ?? 0));
    saa_json(['success' => true, 'data' => $items]);
}

function saa_calculate_university_match(array $item, array $profile): int
{
    $score = (int) ($item['match_score'] ?? 65);
    if (($profile['degree_level'] ?? '') !== '' && in_array($profile['degree_level'], $item['degree_levels'] ?? [], true)) {
        $score += 5;
    }
    if (in_array($item['country'], $profile['preferred_countries'] ?? [], true)) {
        $score += 6;
    }
    if (($profile['annual_budget_usd'] ?? null) !== null && (float) $item['tuition_fee_usd'] <= (float) $profile['annual_budget_usd']) {
        $score += 5;
    }
    if (($profile['gpa'] ?? null) !== null && (float) $item['gpa_requirement'] <= (float) $profile['gpa']) {
        $score += 4;
    }

    return max(40, min(99, $score));
}

function saa_scholarship_recommendations(array $db, array $user): void
{
    $items = array_values($db['scholarships']);
    $query = $_GET;
    $profile = saa_profile_for_user($db, $user);
    $shortlisted = saa_shortlisted_ids($db, (int) $user['id'], 'scholarship');

    $items = array_filter($items, function (array $item) use ($query, $profile): bool {
        if (!empty($query['funding_country']) && $item['funding_country'] !== $query['funding_country']) {
            return false;
        }
        if (!empty($query['degree_level']) && !in_array($query['degree_level'], $item['degree_levels'] ?? [], true)) {
            return false;
        }
        if (!empty($query['coverage']) && $item['coverage'] !== $query['coverage']) {
            return false;
        }
        $eligible = $item['eligible_nationalities'] ?? [];
        if (($profile['nationality'] ?? '') !== '' && !in_array('All', $eligible, true) && !in_array($profile['nationality'], $eligible, true)) {
            return false;
        }
        return true;
    });

    $items = array_map(function (array $item) use ($shortlisted): array {
        $item['is_shortlisted'] = in_array((int) $item['id'], $shortlisted, true);
        return saa_scholarship_response($item);
    }, array_values($items));

    saa_json(['success' => true, 'data' => $items]);
}

function saa_shortlisted_ids(array $db, int $userId, string $type): array
{
    $ids = [];
    foreach ($db['shortlists'] as $row) {
        if ((int) $row['user_id'] === $userId && $row['entity_type'] === $type) {
            $ids[] = (int) $row['entity_id'];
        }
    }
    return $ids;
}

function saa_shortlist_index(array $db, array $user): void
{
    $universityIds = saa_shortlisted_ids($db, (int) $user['id'], 'university');
    $scholarshipIds = saa_shortlisted_ids($db, (int) $user['id'], 'scholarship');

    saa_json([
        'success' => true,
        'data' => [
            'universities' => array_map('saa_university_response', array_values(array_filter($db['universities'], fn (array $item): bool => in_array((int) $item['id'], $universityIds, true)))),
            'scholarships' => array_map('saa_scholarship_response', array_values(array_filter($db['scholarships'], fn (array $item): bool => in_array((int) $item['id'], $scholarshipIds, true)))),
        ],
    ]);
}

function saa_validate_profile_input(array $input): array
{
    $errors = [];
    foreach ([
        'nationality',
        'current_country',
        'current_qualification',
        'field_of_interest',
        'degree_level',
        'other_languages',
        'target_intake',
        'ranking_preference',
    ] as $field) {
        if (array_key_exists($field, $input)) {
            saa_validate_text_field($errors, $field, $input[$field], 150);
        }
    }

    saa_validate_numeric_field($errors, 'gpa', $input, 0, 4);
    saa_validate_numeric_field($errors, 'annual_budget_usd', $input, 0, null);
    saa_validate_numeric_field($errors, 'ielts_score', $input, 0, 9);
    saa_validate_numeric_field($errors, 'toefl_score', $input, 0, 120);

    if (array_key_exists('preferred_countries', $input)) {
        foreach (saa_array_value($input['preferred_countries']) as $country) {
            if (saa_contains_unsafe_text($country)) {
                $errors['preferred_countries'][] = 'Preferred countries contain unsupported characters.';
                break;
            }
        }
    }

    return $errors;
}

function saa_shortlist_store(array $db, array $user): void
{
    $input = saa_input();
    $type = (string) ($input['entity_type'] ?? '');
    $entityId = (int) ($input['entity_id'] ?? 0);

    if (!in_array($type, ['university', 'scholarship'], true) || saa_entity_by_id($db, $type, $entityId) === null) {
        saa_error('Invalid shortlist item', 422, ['entity_id' => ['Selected item does not exist.']]);
        return;
    }

    foreach ($db['shortlists'] as $row) {
        if ((int) $row['user_id'] === (int) $user['id'] && $row['entity_type'] === $type && (int) $row['entity_id'] === $entityId) {
            saa_error('Already in shortlist', 409);
            return;
        }
    }

    $db['shortlists'][] = [
        'id' => saa_next_id($db['shortlists']),
        'user_id' => (int) $user['id'],
        'entity_type' => $type,
        'entity_id' => $entityId,
        'created_at' => gmdate('c'),
    ];

    saa_save_db($db);
    saa_json(['success' => true, 'message' => 'Added to shortlist'], 201);
}

function saa_shortlist_delete(array $db, array $user, int $entityId): void
{
    $type = $_GET['entity_type'] ?? null;
    $db['shortlists'] = array_values(array_filter($db['shortlists'], function (array $row) use ($user, $entityId, $type): bool {
        $sameUser = (int) $row['user_id'] === (int) $user['id'];
        $sameEntity = (int) $row['entity_id'] === $entityId;
        $sameType = $type === null || $row['entity_type'] === $type;
        return !($sameUser && $sameEntity && $sameType);
    }));

    saa_save_db($db);
    saa_json(['success' => true, 'message' => 'Removed from shortlist']);
}

function saa_entity_by_id(array $db, string $type, int $id): ?array
{
    $collection = $type === 'university' ? 'universities' : ($type === 'scholarship' ? 'scholarships' : '');
    if ($collection === '') {
        return null;
    }
    foreach ($db[$collection] as $item) {
        if ((int) $item['id'] === $id) {
            return $item;
        }
    }
    return null;
}

function saa_application_guide(array $db, string $type, int $id): void
{
    $entity = saa_entity_by_id($db, $type, $id);
    if ($entity === null) {
        saa_error('Item not found', 404);
        return;
    }

    $deadline = $type === 'university' ? ($entity['application_deadline'] ?? null) : ($entity['deadline'] ?? null);
    saa_json([
        'success' => true,
        'data' => [
            'entity' => $entity,
            'required_documents' => [
                'Valid passport',
                'Official transcripts',
                'IELTS/TOEFL score report',
                'Statement of Purpose or Motivation Letter',
                'Recommendation letters',
                'CV or resume',
            ],
            'steps' => [
                ['order' => 1, 'title' => 'Research requirements', 'description' => 'Review eligibility, program details, and document rules.'],
                ['order' => 2, 'title' => 'Prepare documents', 'description' => 'Collect, scan, and proofread all required application documents.'],
                ['order' => 3, 'title' => 'Submit online application', 'description' => 'Create an official portal account and submit before the deadline.'],
                ['order' => 4, 'title' => 'Track status', 'description' => 'Check the portal and email regularly for updates.'],
            ],
            'deadlines' => [
                'application' => $deadline,
                'documents' => $deadline,
            ],
            'tips' => [
                'Start at least three months before the deadline.',
                'Tailor your SOP for each target.',
                'Keep copies of every submitted document.',
            ],
            'portal_link' => $type === 'university' ? ($entity['website'] ?? '') : ($entity['link'] ?? ''),
        ],
    ]);
}

function saa_user_milestones(array $db, int $userId): array
{
    $items = array_values(array_filter($db['roadmap_milestones'], fn (array $item): bool => (int) $item['user_id'] === $userId));
    usort($items, fn (array $a, array $b): int => ((int) $a['order']) <=> ((int) $b['order']));
    return array_map(function (array $item): array {
        unset($item['user_id']);
        return $item;
    }, $items);
}

function saa_roadmap_index(array $db, array $user): void
{
    $milestones = saa_user_milestones($db, (int) $user['id']);
    if (count($milestones) === 0) {
        $nextId = saa_next_id($db['roadmap_milestones']);
        foreach (saa_default_milestones((int) $user['id']) as $milestone) {
            $milestone['id'] = $nextId++;
            $db['roadmap_milestones'][] = $milestone;
        }
        saa_save_db($db);
        $milestones = saa_user_milestones($db, (int) $user['id']);
    }

    $profile = saa_profile_for_user($db, $user);

    saa_json([
        'success' => true,
        'data' => [
            'target_intake' => $profile['target_intake'] ?: 'Fall 2027',
            'milestones' => $milestones,
        ],
    ]);
}

function saa_roadmap_generate(array $db, array $user): void
{
    $input = saa_input();
    $targetIntake = trim((string) ($input['target_intake'] ?? 'Fall 2027'));
    $newMilestones = saa_default_milestones((int) $user['id']);

    $db['roadmap_milestones'] = array_values(array_filter($db['roadmap_milestones'], fn (array $item): bool => (int) $item['user_id'] !== (int) $user['id']));
    $nextId = saa_next_id($db['roadmap_milestones']);
    foreach ($newMilestones as $milestone) {
        $milestone['id'] = $nextId++;
        $db['roadmap_milestones'][] = $milestone;
    }

    foreach ($db['profiles'] as $index => $profile) {
        if ((int) ($profile['user_id'] ?? 0) === (int) $user['id']) {
            $db['profiles'][$index]['target_intake'] = $targetIntake;
        }
    }

    saa_save_db($db);
    saa_json([
        'success' => true,
        'message' => 'Roadmap generated',
        'data' => ['milestones' => saa_user_milestones($db, (int) $user['id'])],
    ], 201);
}

function saa_roadmap_update_milestone(array $db, array $user, int $id): void
{
    $input = saa_input();
    $status = (string) ($input['status'] ?? '');
    if (!in_array($status, ['Not Started', 'In Progress', 'Done'], true)) {
        saa_error('Invalid milestone status', 422, ['status' => ['Status must be Not Started, In Progress, or Done.']]);
        return;
    }

    foreach ($db['roadmap_milestones'] as $index => $milestone) {
        if ((int) $milestone['id'] === $id && (int) $milestone['user_id'] === (int) $user['id']) {
            $db['roadmap_milestones'][$index]['status'] = $status;
            saa_save_db($db);
            saa_json(['success' => true, 'message' => 'Milestone updated']);
            return;
        }
    }

    saa_error('Milestone not found', 404);
}

function saa_template_download(array $db, int $id): void
{
    $template = null;
    foreach ($db['templates'] as $item) {
        if ((int) $item['id'] === $id) {
            $template = $item;
            break;
        }
    }

    if ($template === null) {
        saa_error('Template not found', 404);
        return;
    }

    $format = strtolower((string) ($_GET['format'] ?? 'pdf'));
    if (!in_array($format, ['pdf', 'docx'], true)) {
        saa_error('Unsupported template format', 422, ['format' => ['Format must be pdf or docx.']]);
        return;
    }

    $slug = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $template['name']) ?: 'template');
    $body = $template['name'] . "\n\n" . $template['description'] . "\n\nUse this structure as a starting point for your study abroad application.";

    if ($format === 'pdf') {
        $content = saa_make_pdf($template['name'], $body);
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $slug . '.pdf"');
        header('Content-Length: ' . strlen($content));
        echo $content;
        return;
    }

    $docx = saa_make_docx($template['name'], $body);
    header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    header('Content-Disposition: attachment; filename="' . $slug . '.docx"');
    header('Content-Length: ' . strlen($docx));
    echo $docx;
}

function saa_make_pdf(string $title, string $body): string
{
    $lines = array_slice(array_filter(array_map('trim', explode("\n", wordwrap($body, 82)))), 0, 24);
    $stream = "BT\n/F1 18 Tf\n72 760 Td\n(" . saa_pdf_escape($title) . ") Tj\n/F1 11 Tf\n0 -32 Td\n";
    foreach ($lines as $line) {
        $stream .= '(' . saa_pdf_escape($line) . ") Tj\n0 -16 Td\n";
    }
    $stream .= "ET";

    $objects = [
        "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
        "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
        "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
        "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
        "5 0 obj\n<< /Length " . strlen($stream) . " >>\nstream\n" . $stream . "\nendstream\nendobj\n",
    ];

    $pdf = "%PDF-1.4\n";
    $offsets = [0];
    foreach ($objects as $object) {
        $offsets[] = strlen($pdf);
        $pdf .= $object;
    }
    $xref = strlen($pdf);
    $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
    for ($i = 1; $i <= count($objects); $i++) {
        $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
    }
    $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n" . $xref . "\n%%EOF";

    return $pdf;
}

function saa_pdf_escape(string $value): string
{
    return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $value);
}

function saa_make_docx(string $title, string $body): string
{
    if (!class_exists('ZipArchive')) {
        return $title . "\n\n" . $body;
    }

    $tmp = tempnam(sys_get_temp_dir(), 'saa_docx_');
    $zip = new ZipArchive();
    if ($tmp === false || $zip->open($tmp, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        return $title . "\n\n" . $body;
    }
    $zip->addFromString('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
    $zip->addFromString('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
    $paragraphs = '';
    foreach (array_filter(array_map('trim', explode("\n", $body))) as $line) {
        $paragraphs .= '<w:p><w:r><w:t>' . htmlspecialchars($line, ENT_XML1) . '</w:t></w:r></w:p>';
    }
    $zip->addFromString('word/document.xml', '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>' . htmlspecialchars($title, ENT_XML1) . '</w:t></w:r></w:p>' . $paragraphs . '</w:body></w:document>');
    $zip->close();
    $content = file_get_contents($tmp) ?: ($title . "\n\n" . $body);
    unlink($tmp);

    return $content;
}

function saa_writing_generate(array $db, array $user): void
{
    $input = saa_input();
    $required = ['document_type', 'target_university', 'target_program', 'achievements', 'background'];
    $errors = [];
    foreach ($required as $field) {
        if (trim((string) ($input[$field] ?? '')) === '') {
            $errors[$field][] = 'This field is required.';
        }
    }
    if ($errors !== []) {
        saa_error('Validation failed', 422, $errors);
        return;
    }

    $content = saa_generate_document_text($input);
    $document = [
        'id' => saa_next_id($db['documents']),
        'user_id' => (int) $user['id'],
        'document_type' => (string) $input['document_type'],
        'content' => $content,
        'word_count' => saa_word_count($content),
        'created_at' => gmdate('c'),
        'updated_at' => gmdate('c'),
    ];
    $db['documents'][] = $document;
    saa_save_db($db);

    unset($document['user_id'], $document['updated_at']);
    saa_json(['success' => true, 'data' => $document]);
}

function saa_generate_document_text(array $input): string
{
    $type = ucwords(str_replace('_', ' ', (string) $input['document_type']));
    $university = (string) $input['target_university'];
    $program = (string) $input['target_program'];
    $achievements = (string) $input['achievements'];
    $background = (string) $input['background'];

    return "Draft {$type}\n\n"
        . "I am excited to apply for {$program} at {$university}. My academic background and long-term goals have guided me toward this opportunity, and I believe the program matches both my preparation and my future direction.\n\n"
        . "My background includes {$background}. These experiences helped me build discipline, curiosity, and a clear understanding of the field I want to pursue.\n\n"
        . "Among my key achievements, {$achievements}. These accomplishments show my ability to learn independently, work with others, and follow a project through to completion.\n\n"
        . "At {$university}, I hope to deepen my technical knowledge, contribute actively to the academic community, and prepare for work that creates practical value. I will revise this draft with specific course names, faculty interests, and personal examples before submission.";
}

function saa_writing_update(array $db, array $user, int $id): void
{
    $input = saa_input();
    $content = trim((string) ($input['content'] ?? ''));
    if ($content === '') {
        saa_error('Validation failed', 422, ['content' => ['Content is required.']]);
        return;
    }

    foreach ($db['documents'] as $index => $document) {
        if ((int) $document['id'] === $id && (int) $document['user_id'] === (int) $user['id']) {
            $db['documents'][$index]['content'] = $content;
            $db['documents'][$index]['word_count'] = saa_word_count($content);
            $db['documents'][$index]['updated_at'] = gmdate('c');
            saa_save_db($db);
            saa_json(['success' => true, 'message' => 'Document saved']);
            return;
        }
    }

    saa_error('Document not found', 404);
}

function saa_writing_refine(array $db, array $user, int $id): void
{
    $input = saa_input();
    $instructions = trim((string) ($input['instructions'] ?? ''));
    if ($instructions === '') {
        saa_error('Validation failed', 422, ['instructions' => ['Instructions are required.']]);
        return;
    }

    foreach ($db['documents'] as $index => $document) {
        if ((int) $document['id'] === $id && (int) $document['user_id'] === (int) $user['id']) {
            $content = $document['content'] . "\n\nRefinement note: " . $instructions . "\n\nA stronger final version should add one concrete example, mention why this exact program is a fit, and keep the tone formal but personal.";
            $db['documents'][$index]['content'] = $content;
            $db['documents'][$index]['word_count'] = saa_word_count($content);
            $db['documents'][$index]['updated_at'] = gmdate('c');
            saa_save_db($db);
            saa_json([
                'success' => true,
                'data' => [
                    'id' => $id,
                    'content' => $content,
                    'word_count' => saa_word_count($content),
                ],
            ]);
            return;
        }
    }

    saa_error('Document not found', 404);
}

function saa_word_count(string $text): int
{
    return count(array_filter(preg_split('/\s+/', trim($text)) ?: []));
}

function saa_admin_dashboard(array $db): void
{
    $students = array_values(array_filter($db['users'], fn (array $user): bool => $user['role'] === 'student'));
    usort($students, fn (array $a, array $b): int => strcmp((string) ($b['registered_at'] ?? ''), (string) ($a['registered_at'] ?? '')));

    saa_json([
        'success' => true,
        'data' => [
            'total_students' => count($students),
            'total_universities' => count($db['universities']),
            'total_scholarships' => count($db['scholarships']),
            'active_sessions' => count(array_filter($db['users'], fn (array $user): bool => ($user['status'] ?? 'active') === 'active')),
            'recent_registrations' => array_slice(array_map(fn (array $user): array => saa_admin_student_response($db, $user), $students), 0, 5),
        ],
    ]);
}

function saa_admin_create_university(array $db): void
{
    $input = saa_input();
    $errors = array_merge(saa_validate_required($input, ['name', 'country']), saa_validate_university_input($input));
    if ($errors !== []) {
        saa_error('Validation failed', 422, $errors);
        return;
    }

    $item = saa_university_payload($input, saa_next_id($db['universities']));
    $db['universities'][] = $item;
    saa_save_db($db);
    saa_json(['success' => true, 'message' => 'University created', 'data' => saa_university_response($item)], 201);
}

function saa_admin_update_university(array $db, int $id): void
{
    $index = saa_find_index_by_id($db['universities'], $id);
    if ($index === null) {
        saa_error('University not found', 404);
        return;
    }

    $input = saa_input();
    $errors = saa_validate_university_input($input);
    if ($errors !== []) {
        saa_error('Validation failed', 422, $errors);
        return;
    }

    $item = array_merge($db['universities'][$index], saa_university_payload($input, $id, false));
    $db['universities'][$index] = $item;
    saa_save_db($db);
    saa_json(['success' => true, 'message' => 'University updated', 'data' => saa_university_response($item)]);
}

function saa_validate_university_input(array $input): array
{
    $errors = [];

    foreach (['name', 'country', 'city'] as $field) {
        if (array_key_exists($field, $input)) {
            saa_validate_text_field($errors, $field, $input[$field], $field === 'name' ? 150 : 80);
        }
    }
    if (array_key_exists('description', $input)) {
        saa_validate_text_field($errors, 'description', $input['description'], 1000);
    }

    saa_validate_numeric_field($errors, 'ranking', $input, 1, null, true);
    saa_validate_numeric_field($errors, 'tuition_fee_usd', $input, 0, null);
    saa_validate_numeric_field($errors, 'gpa_requirement', $input, 0, 4);
    saa_validate_numeric_field($errors, 'ielts_requirement', $input, 0, 9);
    saa_validate_numeric_field($errors, 'match_score', $input, 0, 100);

    if (array_key_exists('application_deadline', $input)) {
        saa_validate_date_field($errors, 'application_deadline', $input['application_deadline']);
    }
    foreach (['portal_url', 'website'] as $field) {
        if (array_key_exists($field, $input)) {
            saa_validate_url_field($errors, $field, $input[$field]);
        }
    }
    if (array_key_exists('programs', $input)) {
        foreach (saa_array_value($input['programs']) as $program) {
            if (strlen($program) > 120 || saa_contains_unsafe_text($program)) {
                $errors['programs'][] = 'Programs contain an invalid value.';
                break;
            }
        }
    }

    return $errors;
}

function saa_university_payload(array $input, int $id, bool $creating = true): array
{
    $base = $creating ? [
        'id' => $id,
        'name' => '',
        'country' => '',
        'city' => '',
        'ranking' => null,
        'programs' => [],
        'tuition_fee_usd' => 0,
        'gpa_requirement' => null,
        'ielts_requirement' => null,
        'application_deadline' => '',
        'degree_levels' => ['Master'],
        'match_score' => 75,
        'website' => '',
        'portal_url' => '',
        'description' => 'University listing added by admin.',
    ] : [];

    if (array_key_exists('portal_url', $input) && !array_key_exists('website', $input)) {
        $input['website'] = $input['portal_url'];
    }

    foreach (['name', 'country', 'city', 'website', 'portal_url', 'description'] as $field) {
        if (array_key_exists($field, $input)) {
            $base[$field] = trim((string) $input[$field]);
        }
    }
    foreach (['ranking'] as $field) {
        if (array_key_exists($field, $input)) {
            $base[$field] = saa_nullable_int($input[$field]);
        }
    }
    foreach (['tuition_fee_usd', 'gpa_requirement', 'ielts_requirement', 'match_score'] as $field) {
        if (array_key_exists($field, $input)) {
            $base[$field] = saa_nullable_float($input[$field]);
        }
    }
    if (array_key_exists('application_deadline', $input)) {
        $base['application_deadline'] = trim((string) $input['application_deadline']);
    }
    if (array_key_exists('programs', $input)) {
        $base['programs'] = saa_array_value($input['programs']);
    }
    if (array_key_exists('degree_levels', $input)) {
        $base['degree_levels'] = saa_array_value($input['degree_levels']);
    }

    return $base;
}

function saa_university_response(array $item): array
{
    $portalUrl = trim((string) ($item['portal_url'] ?? ''));
    $website = trim((string) ($item['website'] ?? ''));
    if ($portalUrl === '' && $website !== '') {
        $portalUrl = $website;
    }
    if ($website === '' && $portalUrl !== '') {
        $website = $portalUrl;
    }

    $item['portal_url'] = $portalUrl;
    $item['website'] = $website;
    $item['programs'] = saa_array_value($item['programs'] ?? []);
    $item['degree_levels'] = saa_array_value($item['degree_levels'] ?? []);

    foreach (['city', 'application_deadline', 'description'] as $field) {
        if (!array_key_exists($field, $item)) {
            $item[$field] = '';
        }
    }
    foreach (['ranking', 'gpa_requirement', 'ielts_requirement', 'match_score'] as $field) {
        if (!array_key_exists($field, $item)) {
            $item[$field] = null;
        }
    }
    if (!array_key_exists('tuition_fee_usd', $item) || $item['tuition_fee_usd'] === null || $item['tuition_fee_usd'] === '') {
        $item['tuition_fee_usd'] = 0;
    }

    return $item;
}

function saa_admin_create_scholarship(array $db): void
{
    $input = saa_input();
    $errors = array_merge(saa_validate_required($input, ['name', 'provider']), saa_validate_scholarship_input($input));
    if ($errors !== []) {
        saa_error('Validation failed', 422, $errors);
        return;
    }

    $item = saa_scholarship_payload($input, saa_next_id($db['scholarships']));
    $db['scholarships'][] = $item;
    saa_save_db($db);
    saa_json(['success' => true, 'message' => 'Scholarship created', 'data' => saa_scholarship_response($item)], 201);
}

function saa_admin_update_scholarship(array $db, int $id): void
{
    $index = saa_find_index_by_id($db['scholarships'], $id);
    if ($index === null) {
        saa_error('Scholarship not found', 404);
        return;
    }

    $input = saa_input();
    $errors = saa_validate_scholarship_input($input);
    if ($errors !== []) {
        saa_error('Validation failed', 422, $errors);
        return;
    }

    $item = array_merge($db['scholarships'][$index], saa_scholarship_payload($input, $id, false));
    $db['scholarships'][$index] = $item;
    saa_save_db($db);
    saa_json(['success' => true, 'message' => 'Scholarship updated', 'data' => saa_scholarship_response($item)]);
}

function saa_validate_scholarship_input(array $input): array
{
    $errors = [];

    foreach (['name', 'provider', 'country', 'funding_country'] as $field) {
        if (array_key_exists($field, $input)) {
            saa_validate_text_field($errors, $field, $input[$field], $field === 'name' ? 150 : 100);
        }
    }
    foreach (['amount', 'eligibility', 'eligibility_summary', 'details'] as $field) {
        if (array_key_exists($field, $input)) {
            saa_validate_text_field($errors, $field, $input[$field], 1000);
        }
    }

    $coverage = $input['coverage_type'] ?? ($input['coverage'] ?? null);
    if ($coverage !== null && trim((string) $coverage) !== '' && !saa_is_valid_coverage((string) $coverage)) {
        $errors[array_key_exists('coverage_type', $input) ? 'coverage_type' : 'coverage'][] = 'Coverage type is invalid.';
    }

    $deadline = $input['application_deadline'] ?? ($input['deadline'] ?? null);
    if ($deadline !== null) {
        saa_validate_date_field($errors, array_key_exists('application_deadline', $input) ? 'application_deadline' : 'deadline', $deadline);
    }

    foreach (['portal_url', 'link'] as $field) {
        if (array_key_exists($field, $input)) {
            saa_validate_url_field($errors, $field, $input[$field]);
        }
    }
    foreach (['eligible_nationalities', 'degree_levels'] as $field) {
        if (array_key_exists($field, $input)) {
            foreach (saa_array_value($input[$field]) as $item) {
                if (strlen($item) > 80 || saa_contains_unsafe_text($item)) {
                    $errors[$field][] = 'This field contains an invalid value.';
                    break;
                }
            }
        }
    }

    return $errors;
}

function saa_scholarship_payload(array $input, int $id, bool $creating = true): array
{
    $base = $creating ? [
        'id' => $id,
        'name' => '',
        'provider' => '',
        'funding_country' => '',
        'country' => '',
        'coverage' => '',
        'coverage_type' => '',
        'amount' => '',
        'eligible_nationalities' => ['All'],
        'eligibility_summary' => '',
        'eligibility' => '',
        'degree_levels' => ['Master'],
        'deadline' => '',
        'application_deadline' => '',
        'details' => '',
        'link' => '',
        'portal_url' => '',
    ] : [];

    if (array_key_exists('country', $input) && !array_key_exists('funding_country', $input)) {
        $input['funding_country'] = $input['country'];
    }
    if (array_key_exists('coverage_type', $input) && !array_key_exists('coverage', $input)) {
        $input['coverage'] = saa_coverage_to_canonical((string) $input['coverage_type']);
    }
    if (array_key_exists('application_deadline', $input) && !array_key_exists('deadline', $input)) {
        $input['deadline'] = $input['application_deadline'];
    }
    if (array_key_exists('eligibility', $input) && !array_key_exists('eligibility_summary', $input)) {
        $input['eligibility_summary'] = $input['eligibility'];
    }
    if (array_key_exists('portal_url', $input) && !array_key_exists('link', $input)) {
        $input['link'] = $input['portal_url'];
    }
    if (array_key_exists('amount', $input) && !array_key_exists('details', $input)) {
        $input['details'] = $input['amount'];
    }

    foreach (['name', 'provider', 'funding_country', 'country', 'coverage', 'coverage_type', 'amount', 'eligibility_summary', 'eligibility', 'deadline', 'application_deadline', 'details', 'link', 'portal_url'] as $field) {
        if (array_key_exists($field, $input)) {
            $base[$field] = trim((string) $input[$field]);
        }
    }
    if (array_key_exists('coverage', $input) && !array_key_exists('coverage_type', $input)) {
        $base['coverage_type'] = saa_coverage_to_admin_label((string) $input['coverage']);
    }
    if (array_key_exists('coverage_type', $input)) {
        $base['coverage_type'] = trim((string) $input['coverage_type']);
        $base['coverage'] = saa_coverage_to_canonical((string) $input['coverage_type']);
    }
    if (array_key_exists('eligible_nationalities', $input)) {
        $base['eligible_nationalities'] = saa_array_value($input['eligible_nationalities']);
    }
    if (array_key_exists('degree_levels', $input)) {
        $base['degree_levels'] = saa_array_value($input['degree_levels']);
    }

    return $base;
}

function saa_scholarship_response(array $item): array
{
    $country = trim((string) ($item['country'] ?? $item['funding_country'] ?? ''));
    $fundingCountry = trim((string) ($item['funding_country'] ?? $country));
    $coverage = trim((string) ($item['coverage'] ?? ''));
    $coverageType = trim((string) ($item['coverage_type'] ?? ''));
    if ($coverage === '' && $coverageType !== '') {
        $coverage = saa_coverage_to_canonical($coverageType);
    }
    if ($coverageType === '' && $coverage !== '') {
        $coverageType = saa_coverage_to_admin_label($coverage);
    }
    $deadline = trim((string) ($item['deadline'] ?? $item['application_deadline'] ?? ''));
    $eligibility = trim((string) ($item['eligibility'] ?? $item['eligibility_summary'] ?? ''));
    $link = trim((string) ($item['link'] ?? ''));
    $portalUrl = trim((string) ($item['portal_url'] ?? ''));
    if ($link === '' && $portalUrl !== '') {
        $link = $portalUrl;
    }
    $amount = trim((string) ($item['amount'] ?? ''));
    $details = trim((string) ($item['details'] ?? ''));
    if ($details === '' && $amount !== '') {
        $details = $amount;
    }

    $item['country'] = $country !== '' ? $country : $fundingCountry;
    $item['funding_country'] = $fundingCountry !== '' ? $fundingCountry : $country;
    $item['coverage'] = $coverage;
    $item['coverage_type'] = $coverageType;
    $item['deadline'] = $deadline;
    $item['application_deadline'] = $deadline;
    $item['eligibility_summary'] = $eligibility;
    $item['eligibility'] = $eligibility;
    $item['link'] = $link;
    $item['portal_url'] = $link;
    $item['amount'] = $amount !== '' ? $amount : $details;
    $item['details'] = $details;
    $item['eligible_nationalities'] = saa_array_value($item['eligible_nationalities'] ?? ['All']);
    $item['degree_levels'] = saa_array_value($item['degree_levels'] ?? ['Master']);

    return $item;
}

function saa_coverage_to_canonical(string $coverage): string
{
    $normalized = strtolower(trim($coverage));
    return match ($normalized) {
        'full' => 'Fully Funded',
        'partial' => 'Partial Funding',
        'tuition only', 'tuition' => 'Tuition Waiver',
        default => trim($coverage),
    };
}

function saa_coverage_to_admin_label(string $coverage): string
{
    $normalized = strtolower(trim($coverage));
    return match ($normalized) {
        'fully funded', 'full' => 'Full',
        'partial funding', 'partial' => 'Partial',
        'tuition waiver', 'tuition only', 'tuition' => 'Tuition Only',
        default => trim($coverage),
    };
}

function saa_is_valid_coverage(string $coverage): bool
{
    return in_array(strtolower(trim($coverage)), [
        'full',
        'partial',
        'tuition only',
        'tuition',
        'fully funded',
        'partial funding',
        'tuition waiver',
        'stipend only',
    ], true);
}

function saa_admin_delete_entity(array $db, string $collection, string $type, int $id): void
{
    $index = saa_find_index_by_id($db[$collection], $id);
    if ($index === null) {
        saa_error('Item not found', 404);
        return;
    }

    array_splice($db[$collection], $index, 1);
    $db['shortlists'] = array_values(array_filter($db['shortlists'], fn (array $row): bool => !($row['entity_type'] === $type && (int) $row['entity_id'] === $id)));
    saa_save_db($db);
    saa_json(['success' => true, 'message' => $type === 'university' ? 'University deleted' : 'Scholarship deleted']);
}

function saa_admin_students(array $db): void
{
    $students = array_values(array_filter($db['users'], fn (array $user): bool => $user['role'] === 'student'));
    saa_json([
        'success' => true,
        'data' => array_map(fn (array $user): array => saa_admin_student_response($db, $user), $students),
    ]);
}

function saa_admin_student_response(array $db, array $user): array
{
    $profile = saa_profile_for_user($db, $user);
    $degreeLevel = (string) ($profile['degree_level'] ?? '');

    return [
        'id' => (int) $user['id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'] ?? '',
        'status' => $user['status'] ?? 'active',
        'registered_at' => $user['registered_at'] ?? '',
        'degree_level' => $degreeLevel,
        'degree' => $degreeLevel,
        'preferred_countries' => saa_array_value($profile['preferred_countries'] ?? []),
        'completion_percentage' => saa_profile_completion($profile),
    ];
}

function saa_admin_update_student_status(array $db, int $id): void
{
    $input = saa_input();
    $status = (string) ($input['status'] ?? '');
    if (!in_array($status, ['active', 'inactive'], true)) {
        saa_error('Invalid status', 422, ['status' => ['Status must be active or inactive.']]);
        return;
    }

    foreach ($db['users'] as $index => $user) {
        if ((int) $user['id'] === $id && $user['role'] === 'student') {
            $db['users'][$index]['status'] = $status;
            saa_save_db($db);
            saa_json(['success' => true, 'message' => 'Student ' . ($status === 'active' ? 'activated' : 'deactivated')]);
            return;
        }
    }

    saa_error('Student not found', 404);
}

function saa_admin_delete_student(array $db, int $id): void
{
    $db['users'] = array_values(array_filter($db['users'], fn (array $user): bool => !((int) $user['id'] === $id && $user['role'] === 'student')));
    $db['profiles'] = array_values(array_filter($db['profiles'], fn (array $row): bool => (int) $row['user_id'] !== $id));
    $db['shortlists'] = array_values(array_filter($db['shortlists'], fn (array $row): bool => (int) $row['user_id'] !== $id));
    $db['roadmap_milestones'] = array_values(array_filter($db['roadmap_milestones'], fn (array $row): bool => (int) $row['user_id'] !== $id));
    $db['documents'] = array_values(array_filter($db['documents'], fn (array $row): bool => (int) $row['user_id'] !== $id));
    saa_save_db($db);
    saa_json(['success' => true, 'message' => 'Student deleted']);
}

function saa_validate_required(array $input, array $fields): array
{
    $errors = [];
    foreach ($fields as $field) {
        if (!array_key_exists($field, $input)) {
            $errors[$field][] = 'This field is required.';
            continue;
        }

        $value = $input[$field];
        $empty = is_array($value) ? count(saa_array_value($value)) === 0 : trim((string) $value) === '';
        if ($empty) {
            $errors[$field][] = 'This field is required.';
        }
    }
    return $errors;
}

function saa_validate_text_field(array &$errors, string $field, mixed $value, int $maxLength): void
{
    $text = trim((string) $value);
    if ($text === '') {
        return;
    }
    if (strlen($text) > $maxLength) {
        $errors[$field][] = 'This field is too long.';
    }
    if (saa_contains_unsafe_text($text)) {
        $errors[$field][] = 'This field contains unsupported characters.';
    }
}

function saa_validate_numeric_field(array &$errors, string $field, array $input, ?float $min = null, ?float $max = null, bool $integer = false): void
{
    if (!array_key_exists($field, $input) || $input[$field] === '' || $input[$field] === null) {
        return;
    }

    if (!is_numeric($input[$field])) {
        $errors[$field][] = 'This field must be a valid number.';
        return;
    }

    $value = (float) $input[$field];
    if ($integer && floor($value) !== $value) {
        $errors[$field][] = 'This field must be a whole number.';
    }
    if ($min !== null && $value < $min) {
        $errors[$field][] = 'This field must be at least ' . saa_format_number_label($min) . '.';
    }
    if ($max !== null && $value > $max) {
        $errors[$field][] = 'This field must be at most ' . saa_format_number_label($max) . '.';
    }
}

function saa_format_number_label(float $value): string
{
    return floor($value) === $value ? (string) (int) $value : (string) $value;
}

function saa_validate_date_field(array &$errors, string $field, mixed $value): void
{
    $date = trim((string) $value);
    if ($date === '') {
        return;
    }

    $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if ($parsed === false || $parsed->format('Y-m-d') !== $date) {
        $errors[$field][] = 'Date must use YYYY-MM-DD format.';
    }
}

function saa_validate_url_field(array &$errors, string $field, mixed $value): void
{
    $url = trim((string) $value);
    if ($url === '') {
        return;
    }
    if (strlen($url) > 500 || !filter_var($url, FILTER_VALIDATE_URL)) {
        $errors[$field][] = 'Enter a valid URL.';
    }
}

function saa_contains_unsafe_text(string $value): bool
{
    return $value !== strip_tags($value) || (bool) preg_match('/[<>]/', $value);
}

function saa_nullable_int(mixed $value): ?int
{
    return $value === '' || $value === null ? null : (int) $value;
}

function saa_nullable_float(mixed $value): ?float
{
    return $value === '' || $value === null ? null : (float) $value;
}

function saa_array_value(mixed $value): array
{
    if (is_array($value)) {
        return array_values(array_filter(array_map(fn ($item): string => trim((string) $item), $value), fn (string $item): bool => $item !== ''));
    }
    if (is_string($value)) {
        return array_values(array_filter(array_map('trim', explode(',', $value)), fn (string $item): bool => $item !== ''));
    }
    return [];
}

function saa_ensure_demo_data(array $db): array
{
    $changed = false;
    $seed = saa_seed_db();
    foreach (['users', 'profiles', 'universities', 'scholarships', 'shortlists', 'roadmap_milestones', 'documents', 'templates'] as $collection) {
        if (!isset($db[$collection]) || !is_array($db[$collection])) {
            $db[$collection] = [];
            $changed = true;
        }
    }

    foreach (['student@test.com', 'admin@saa.local'] as $email) {
        $seedUser = saa_find_user_by_email($seed, $email);
        if ($seedUser === null) {
            continue;
        }

        $existingIndex = null;
        foreach ($db['users'] as $index => $user) {
            if (strtolower((string) ($user['email'] ?? '')) === $email) {
                $existingIndex = $index;
                break;
            }
        }

        if ($existingIndex === null) {
            $db['users'][] = $seedUser;
            $changed = true;
            continue;
        }

        $knownPassword = $email === 'student@test.com' ? 'Test@1234' : 'Admin@12345';
        $user = $db['users'][$existingIndex];
        if (!password_verify($knownPassword, (string) ($user['password_hash'] ?? ''))) {
            $db['users'][$existingIndex]['password_hash'] = password_hash($knownPassword, PASSWORD_DEFAULT);
            $changed = true;
        }
        if (($user['status'] ?? '') !== 'active') {
            $db['users'][$existingIndex]['status'] = 'active';
            $changed = true;
        }
    }

    $demoStudent = saa_find_user_by_email($db, 'student@test.com', 'student');
    if ($demoStudent !== null) {
        $hasProfile = false;
        foreach ($db['profiles'] as $profile) {
            if ((int) ($profile['user_id'] ?? 0) === (int) $demoStudent['id']) {
                $hasProfile = true;
                break;
            }
        }
        if (!$hasProfile) {
            $profile = $seed['profiles'][0];
            $profile['user_id'] = (int) $demoStudent['id'];
            $db['profiles'][] = $profile;
            $changed = true;
        }

        if (count(saa_user_milestones($db, (int) $demoStudent['id'])) === 0) {
            $nextId = saa_next_id($db['roadmap_milestones']);
            foreach (saa_default_milestones((int) $demoStudent['id']) as $milestone) {
                $milestone['id'] = $nextId++;
                $db['roadmap_milestones'][] = $milestone;
            }
            $changed = true;
        }
    }

    if (count($db['universities']) === 0) {
        $db['universities'] = $seed['universities'];
        $changed = true;
    }
    if (count($db['scholarships']) === 0) {
        $db['scholarships'] = $seed['scholarships'];
        $changed = true;
    }
    if (count($db['templates']) === 0) {
        $db['templates'] = $seed['templates'];
        $changed = true;
    }

    return [$db, $changed];
}

function saa_seed_db(): array
{
    return [
        'users' => [
            [
                'id' => 1,
                'full_name' => 'Hasana Zahid',
                'email' => 'student@test.com',
                'phone' => '+92 300 1234567',
                'password_hash' => password_hash('Test@1234', PASSWORD_DEFAULT),
                'role' => 'student',
                'status' => 'active',
                'registered_at' => '2026-05-01',
            ],
            [
                'id' => 2,
                'full_name' => 'Ahmed Khan',
                'email' => 'ahmed@test.com',
                'phone' => '+92 321 9876543',
                'password_hash' => password_hash('Test@1234', PASSWORD_DEFAULT),
                'role' => 'student',
                'status' => 'active',
                'registered_at' => '2026-05-02',
            ],
            [
                'id' => 100,
                'full_name' => 'SAA Admin',
                'email' => 'admin@saa.local',
                'phone' => '+92 300 0000000',
                'password_hash' => password_hash('Admin@12345', PASSWORD_DEFAULT),
                'role' => 'admin',
                'status' => 'active',
                'registered_at' => '2026-05-01',
            ],
        ],
        'profiles' => [
            [
                'user_id' => 1,
                'nationality' => 'Pakistan',
                'current_country' => 'Pakistan',
                'current_qualification' => "Bachelor's Degree",
                'gpa' => 3.45,
                'field_of_interest' => 'Artificial Intelligence',
                'degree_level' => 'Master',
                'preferred_countries' => ['Germany', 'Canada', 'United Kingdom'],
                'annual_budget_usd' => 12000,
                'ielts_score' => 7.0,
                'toefl_score' => null,
                'other_languages' => 'Urdu, Punjabi',
                'needs_scholarship' => true,
                'target_intake' => 'Fall 2027',
                'ranking_preference' => 'Top 500',
            ],
        ],
        'universities' => saa_seed_universities(),
        'scholarships' => saa_seed_scholarships(),
        'shortlists' => [
            ['id' => 1, 'user_id' => 1, 'entity_type' => 'university', 'entity_id' => 1, 'created_at' => '2026-05-12T08:00:00Z'],
            ['id' => 2, 'user_id' => 1, 'entity_type' => 'university', 'entity_id' => 3, 'created_at' => '2026-05-12T09:00:00Z'],
            ['id' => 3, 'user_id' => 1, 'entity_type' => 'university', 'entity_id' => 5, 'created_at' => '2026-05-12T10:00:00Z'],
            ['id' => 4, 'user_id' => 1, 'entity_type' => 'scholarship', 'entity_id' => 2, 'created_at' => '2026-05-12T11:00:00Z'],
            ['id' => 5, 'user_id' => 1, 'entity_type' => 'scholarship', 'entity_id' => 4, 'created_at' => '2026-05-12T12:00:00Z'],
        ],
        'roadmap_milestones' => saa_default_milestones(1),
        'documents' => [],
        'templates' => [
            ['id' => 1, 'name' => 'Academic CV', 'description' => 'A structured CV template designed for academic applications, highlighting education, research, and publications.', 'category' => 'CV', 'format' => ['pdf', 'docx']],
            ['id' => 2, 'name' => 'Personal Statement', 'description' => 'A template for writing compelling personal statements for university admissions.', 'category' => 'Essay', 'format' => ['pdf', 'docx']],
            ['id' => 3, 'name' => 'Statement of Purpose', 'description' => 'A structured SOP template with sections for background, motivation, goals, and fit.', 'category' => 'Essay', 'format' => ['pdf', 'docx']],
            ['id' => 4, 'name' => 'Motivation Letter', 'description' => 'A formal motivation letter template for scholarship and university applications.', 'category' => 'Letter', 'format' => ['pdf', 'docx']],
            ['id' => 5, 'name' => 'Reference Request Email', 'description' => 'A professional email template for requesting recommendation letters from professors.', 'category' => 'Email', 'format' => ['pdf', 'docx']],
        ],
    ];
}

function saa_seed_universities(): array
{
    return [
        ['id' => 1, 'name' => 'Technical University of Munich', 'country' => 'Germany', 'city' => 'Munich', 'ranking' => 145, 'programs' => ['MSc Computer Science', 'MSc Artificial Intelligence', 'MSc Data Engineering'], 'tuition_fee_usd' => 520, 'gpa_requirement' => 3.0, 'ielts_requirement' => 6.5, 'application_deadline' => '2027-01-15', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 92, 'website' => 'https://www.tum.de', 'description' => "One of Germany's top technical universities with strong AI and CS programs."],
        ['id' => 2, 'name' => 'University of Toronto', 'country' => 'Canada', 'city' => 'Toronto', 'ranking' => 118, 'programs' => ['MSc Computer Science', 'MSc Machine Learning', 'MSc Information Systems'], 'tuition_fee_usd' => 42000, 'gpa_requirement' => 3.3, 'ielts_requirement' => 7.0, 'application_deadline' => '2027-01-10', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 85, 'website' => 'https://www.utoronto.ca', 'description' => "Canada's top-ranked university known for cutting-edge AI research."],
        ['id' => 3, 'name' => 'University of Edinburgh', 'country' => 'United Kingdom', 'city' => 'Edinburgh', 'ranking' => 163, 'programs' => ['MSc Artificial Intelligence', 'MSc Computer Science', 'MSc Data Science'], 'tuition_fee_usd' => 38000, 'gpa_requirement' => 3.2, 'ielts_requirement' => 6.5, 'application_deadline' => '2027-03-01', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 88, 'website' => 'https://www.ed.ac.uk', 'description' => 'A world-renowned university with one of the oldest AI departments.'],
        ['id' => 4, 'name' => 'RWTH Aachen University', 'country' => 'Germany', 'city' => 'Aachen', 'ranking' => 197, 'programs' => ['MSc Computer Science', 'MSc Software Systems Engineering', 'MSc Data Science'], 'tuition_fee_usd' => 600, 'gpa_requirement' => 2.8, 'ielts_requirement' => 6.0, 'application_deadline' => '2027-03-01', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 90, 'website' => 'https://www.rwth-aachen.de', 'description' => "Germany's largest technical university with excellent engineering programs."],
        ['id' => 5, 'name' => 'University of Melbourne', 'country' => 'Australia', 'city' => 'Melbourne', 'ranking' => 134, 'programs' => ['MSc Computer Science', 'MSc Information Technology', 'MSc AI'], 'tuition_fee_usd' => 35000, 'gpa_requirement' => 3.0, 'ielts_requirement' => 6.5, 'application_deadline' => '2027-04-30', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 78, 'website' => 'https://www.unimelb.edu.au', 'description' => "Australia's top university with strong tech and research programs."],
        ['id' => 6, 'name' => 'University of British Columbia', 'country' => 'Canada', 'city' => 'Vancouver', 'ranking' => 186, 'programs' => ['MSc Computer Science', 'MSc Data Science', 'MSc Electrical Engineering'], 'tuition_fee_usd' => 38000, 'gpa_requirement' => 3.2, 'ielts_requirement' => 6.5, 'application_deadline' => '2027-01-31', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 82, 'website' => 'https://www.ubc.ca', 'description' => 'A leading Canadian university in a vibrant west coast city.'],
        ['id' => 7, 'name' => 'Massachusetts Institute of Technology', 'country' => 'United States', 'city' => 'Cambridge', 'ranking' => 1, 'programs' => ['MSc Computer Science', 'MSc Artificial Intelligence', 'MSc EECS'], 'tuition_fee_usd' => 55000, 'gpa_requirement' => 3.7, 'ielts_requirement' => 7.0, 'application_deadline' => '2026-12-15', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 65, 'website' => 'https://www.mit.edu', 'description' => "The world's premier technical university."],
        ['id' => 8, 'name' => 'Bilkent University', 'country' => 'Turkey', 'city' => 'Ankara', 'ranking' => 521, 'programs' => ['MSc Computer Engineering', 'MSc Electrical Engineering', 'MSc Information Systems'], 'tuition_fee_usd' => 14000, 'gpa_requirement' => 3.0, 'ielts_requirement' => 6.0, 'application_deadline' => '2027-05-15', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 75, 'website' => 'https://www.bilkent.edu.tr', 'description' => "Turkey's first private, non-profit university with competitive CS programs."],
        ['id' => 9, 'name' => 'University of Manchester', 'country' => 'United Kingdom', 'city' => 'Manchester', 'ranking' => 178, 'programs' => ['MSc Advanced Computer Science', 'MSc AI', 'MSc Data Science'], 'tuition_fee_usd' => 34000, 'gpa_requirement' => 3.0, 'ielts_requirement' => 6.5, 'application_deadline' => '2027-06-30', 'degree_levels' => ['Master'], 'match_score' => 84, 'website' => 'https://www.manchester.ac.uk', 'description' => 'A Russell Group university known for the birthplace of modern computing.'],
        ['id' => 10, 'name' => 'Technical University of Berlin', 'country' => 'Germany', 'city' => 'Berlin', 'ranking' => 210, 'programs' => ['MSc Computer Science', 'MSc Computer Engineering', 'MSc ICT Innovation'], 'tuition_fee_usd' => 380, 'gpa_requirement' => 2.8, 'ielts_requirement' => 6.0, 'application_deadline' => '2027-02-15', 'degree_levels' => ['Master', 'PhD'], 'match_score' => 91, 'website' => 'https://www.tu.berlin', 'description' => "A prestigious technical university in Germany's capital with near-free tuition."],
    ];
}

function saa_seed_scholarships(): array
{
    return [
        ['id' => 1, 'name' => 'DAAD Scholarships', 'provider' => 'German Academic Exchange Service', 'funding_country' => 'Germany', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['All'], 'eligibility_summary' => "Open to international students with a completed bachelor's degree, minimum GPA 3.0, and English/German proficiency.", 'degree_levels' => ['Master', 'PhD'], 'deadline' => '2026-10-15', 'details' => 'Monthly stipend, health insurance, travel allowance, and tuition waiver.', 'link' => 'https://www.daad.de'],
        ['id' => 2, 'name' => 'Chevening Scholarships', 'provider' => 'UK Government', 'funding_country' => 'United Kingdom', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['Pakistan', 'India', 'Nigeria', 'Bangladesh'], 'eligibility_summary' => 'For students with 2+ years of work experience, strong academic background, and leadership potential.', 'degree_levels' => ['Master'], 'deadline' => '2026-11-01', 'details' => 'Full tuition, monthly stipend, return flights, and arrival allowance.', 'link' => 'https://www.chevening.org'],
        ['id' => 3, 'name' => 'Vanier Canada Graduate Scholarships', 'provider' => 'Government of Canada', 'funding_country' => 'Canada', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['All'], 'eligibility_summary' => 'For doctoral students with academic excellence, research potential, and leadership skills.', 'degree_levels' => ['PhD'], 'deadline' => '2026-11-01', 'details' => '$50,000 per year for three years.', 'link' => 'https://vanier.gc.ca'],
        ['id' => 4, 'name' => 'Turkiye Scholarships', 'provider' => 'Republic of Turkey', 'funding_country' => 'Turkey', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['All'], 'eligibility_summary' => 'Open to international students with strong academics and leadership potential.', 'degree_levels' => ['Bachelor', 'Master', 'PhD'], 'deadline' => '2027-02-20', 'details' => 'Full tuition, monthly stipend, accommodation, health insurance, flight, and Turkish language course.', 'link' => 'https://turkiyeburslari.gov.tr'],
        ['id' => 5, 'name' => 'Australia Awards Scholarships', 'provider' => 'Australian Government', 'funding_country' => 'Australia', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['Pakistan', 'India', 'Bangladesh', 'Nigeria'], 'eligibility_summary' => 'For students from developing countries with work experience and strong academics.', 'degree_levels' => ['Master', 'PhD'], 'deadline' => '2027-04-30', 'details' => 'Full tuition, return air travel, establishment allowance, and living allowance.', 'link' => 'https://www.dfat.gov.au'],
        ['id' => 6, 'name' => 'Erasmus Mundus Joint Masters', 'provider' => 'European Union', 'funding_country' => 'Germany', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['All'], 'eligibility_summary' => 'For students applying to Erasmus Mundus Joint Master programs across European universities.', 'degree_levels' => ['Master'], 'deadline' => '2027-01-15', 'details' => 'Tuition, travel, installation costs, and monthly allowance.', 'link' => 'https://erasmus-plus.ec.europa.eu'],
        ['id' => 7, 'name' => 'Commonwealth Scholarships', 'provider' => 'Commonwealth Scholarship Commission', 'funding_country' => 'United Kingdom', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['Pakistan', 'India', 'Nigeria', 'Bangladesh'], 'eligibility_summary' => 'For students from Commonwealth countries with strong academic background and development impact plans.', 'degree_levels' => ['Master', 'PhD'], 'deadline' => '2026-12-18', 'details' => 'Full tuition, living allowance, return airfare, thesis grant, and warm clothing allowance.', 'link' => 'https://cscuk.fcdo.gov.uk'],
        ['id' => 8, 'name' => 'Fulbright Program', 'provider' => 'US Department of State', 'funding_country' => 'United States', 'coverage' => 'Fully Funded', 'eligible_nationalities' => ['Pakistan', 'India'], 'eligibility_summary' => 'For graduating seniors and young professionals with leadership potential.', 'degree_levels' => ['Master', 'PhD'], 'deadline' => '2027-05-01', 'details' => 'Full tuition, monthly stipend, health insurance, round-trip airfare, and book allowance.', 'link' => 'https://www.fulbright.org'],
        ['id' => 9, 'name' => 'Holland Scholarship', 'provider' => 'Dutch Ministry of Education', 'funding_country' => 'Netherlands', 'coverage' => 'Partial Funding', 'eligible_nationalities' => ['All'], 'eligibility_summary' => 'For non-EEA international students applying to a participating Dutch university for the first time.', 'degree_levels' => ['Bachelor', 'Master'], 'deadline' => '2027-02-01', 'details' => 'One-time grant for the first year of study.', 'link' => 'https://www.studyinholland.nl'],
        ['id' => 10, 'name' => 'SBW Berlin Scholarship', 'provider' => 'SBW Berlin', 'funding_country' => 'Germany', 'coverage' => 'Stipend Only', 'eligible_nationalities' => ['All'], 'eligibility_summary' => 'For international students committed to contributing to their home countries after graduation.', 'degree_levels' => ['Bachelor', 'Master'], 'deadline' => '2027-03-31', 'details' => 'Monthly stipend, mentoring, accommodation support, and networking opportunities.', 'link' => 'https://www.sbw.berlin'],
    ];
}

function saa_default_milestones(int $userId): array
{
    return [
        ['id' => 1, 'user_id' => $userId, 'title' => 'Finalize University List', 'description' => 'Research and shortlist 5-8 universities based on your profile, preferences, and eligibility.', 'suggested_date' => '2026-08-01', 'deadline' => '2026-09-15', 'status' => 'Done', 'order' => 1],
        ['id' => 2, 'user_id' => $userId, 'title' => 'Prepare Required Documents', 'description' => 'Gather transcripts, certificates, passport copy, and other required documents. Get translations if needed.', 'suggested_date' => '2026-09-01', 'deadline' => '2026-10-30', 'status' => 'In Progress', 'order' => 2],
        ['id' => 3, 'user_id' => $userId, 'title' => 'Take IELTS / TOEFL Exam', 'description' => 'Register and take your English proficiency exam. Most universities require IELTS 6.5+ or TOEFL 90+.', 'suggested_date' => '2026-09-15', 'deadline' => '2026-11-15', 'status' => 'Done', 'order' => 3],
        ['id' => 4, 'user_id' => $userId, 'title' => 'Request Recommendation Letters', 'description' => 'Approach 2-3 professors or supervisors and request recommendation letters well in advance.', 'suggested_date' => '2026-10-01', 'deadline' => '2026-11-30', 'status' => 'Not Started', 'order' => 4],
        ['id' => 5, 'user_id' => $userId, 'title' => 'Write Statement of Purpose', 'description' => 'Draft and refine your SOP for each university. Use the Writing Assistant for help.', 'suggested_date' => '2026-10-15', 'deadline' => '2026-12-15', 'status' => 'Not Started', 'order' => 5],
        ['id' => 6, 'user_id' => $userId, 'title' => 'Submit Applications', 'description' => 'Submit online applications to all shortlisted universities before their deadlines.', 'suggested_date' => '2026-11-01', 'deadline' => '2027-01-31', 'status' => 'Not Started', 'order' => 6],
        ['id' => 7, 'user_id' => $userId, 'title' => 'Track Application Status', 'description' => 'Monitor application portals regularly. Respond promptly to requests for additional documents.', 'suggested_date' => '2027-02-01', 'deadline' => '2027-04-30', 'status' => 'Not Started', 'order' => 7],
        ['id' => 8, 'user_id' => $userId, 'title' => 'Prepare for Visa', 'description' => 'Once accepted, gather visa documents, book an appointment, and prepare for the visa interview.', 'suggested_date' => '2027-04-01', 'deadline' => '2027-07-31', 'status' => 'Not Started', 'order' => 8],
    ];
}
