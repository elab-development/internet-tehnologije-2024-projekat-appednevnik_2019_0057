<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Grade;
use App\Models\ParentModel;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $subjects = collect([
            'Matematika',
            'Srpski jezik',
            'Engleski',
            'Biologija',
            'Fizika'
        ])->map(fn($n) => Subject::firstOrCreate(['naziv' => $n]));

        ParentModel::factory()->count(6)->create();
        Teacher::factory()->count(3)->create();
        Student::factory()->count(6)->create();
        Grade::factory()->count(15)->create();

        User::firstOrCreate(
            ['email' => 'admin@ednevnik.com'],
            ['role' => 'admin', 'name' => 'Admin', 'password' => bcrypt('admin')]
        );
    }
}
