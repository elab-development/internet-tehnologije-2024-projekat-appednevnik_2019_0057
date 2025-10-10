<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    
    protected $table = 'students';
    protected $fillable = ['ime', 'razred', 'email', 'telefon', 'parent_model_id'];

    public function parent()
    {
        return $this->belongsTo(ParentModel::class, 'parent_model_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id');
    }
}
