<?php

namespace App\Http\Controllers;

use App\Models\SolutionSubtheme;
use Illuminate\Http\Request;

class SolutionSubthemeController extends BasicController
{
    public $model = SolutionSubtheme::class;
    public $reactView = 'SolutionSubtheme';
    public $reactRootView = 'public';
}



