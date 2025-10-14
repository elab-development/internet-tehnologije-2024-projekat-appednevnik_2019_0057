<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Grade>
 */
class GradeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $student = Student::inRandomOrder()->first() ?? Student::factory()->create();
        $teacher = Teacher::inRandomOrder()->first() ?? Teacher::factory()->create();

        return [
            'student_id' => $student->id,
            'teacher_id' => $teacher->id,
            'ocena' => $this->faker->numberBetween(1, 5),
            'datum' => $this->faker->dateTimeBetween('-2 months', 'now')->format('Y-m-d'),
        ];
    }
}
