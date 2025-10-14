<?php

namespace Database\Factories;

use App\Models\ParentModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->ucenik()->create();
        $parent = ParentModel::inRandomOrder()->first() ?? ParentModel::factory()->create();

        return [
            'user_id' => $user->id,
            'razred' => $this->faker->randomElement(['I-1', 'II-2', 'III-3', 'IV-1']),
            'telefon' => $this->faker->phoneNumber(),
            'parent_model_id' => $parent->id,
        ];
    }
}
