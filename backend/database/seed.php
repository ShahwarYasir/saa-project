<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/app.php';

try {
    $seed = saa_seed_db();
    saa_mysql_replace_db($seed);
    $counts = saa_mysql_counts();

    echo "SAA MySQL seed completed successfully.\n";
    echo "Database: " . saa_env('DB_DATABASE', 'saa_project') . "\n";
    echo "Demo student: student@test.com / Test@1234\n";
    echo "Demo admin: admin@saa.local / Admin@12345\n";
    echo "Rows:\n";
    foreach ($counts as $table => $count) {
        echo "- {$table}: {$count}\n";
    }
    echo "\nThis script is safe to run multiple times. It resets the demo database to a known seed state.\n";
} catch (Throwable $exception) {
    fwrite(STDERR, "SAA MySQL seed failed: " . $exception->getMessage() . "\n");
    exit(1);
}
