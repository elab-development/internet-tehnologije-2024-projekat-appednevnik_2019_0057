<?php

namespace Database\Factories;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->nastavnik()->create();
        $subject = Subject::inRandomOrder()->first() ?? Subject::factory()->create();

        return [
            'user_id' => $user->id,
            'telefon' => $this->faker->phoneNumber(),
            'subject_id' => $subject->id,
        ];
    }
}
