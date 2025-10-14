<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
            'password' => bcrypt('password'),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn() => ['role' => 'admin']);
    }

    public function nastavnik(): static
    {
        return $this->state(fn() => ['role' => 'nastavnik']);
    }

    public function roditelj(): static
    {
        return $this->state(fn() => ['role' => 'roditelj']);
    }

    public function ucenik(): static
    {
        return $this->state(fn() => ['role' => 'ucenik']);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
