<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ParentModel>
 */
class ParentModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->roditelj()->create();

        return [
            'user_id' => $user->id,
            'telefon' => $this->faker->phoneNumber(),
        ];
    }
}
