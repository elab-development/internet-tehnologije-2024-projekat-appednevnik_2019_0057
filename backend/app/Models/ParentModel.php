<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentModel extends Model
{
    use HasFactory;

    protected $table = 'parent_models';
    protected $fillable = ['ime', 'email', 'telefon'];

    public function students()
    {
        return $this->hasMany(Student::class, 'parent_model_id');
    }
}
