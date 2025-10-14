<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = ['Matematika', 'Biologija', 'Fizika', 'Hemija', 'Informatika'];
        return [
            'naziv' => $this->faker->unique()->randomElement($subjects),
        ];
    }
}
