<?php

namespace App\Http\Controllers;

use App\Models\LandingHome;
use App\Models\ServiceSubtheme;
use Illuminate\Http\Request;

class ServiceSubthemeController extends BasicController
{
    public $model = ServiceSubtheme::class;
    public $reactView = 'ServiceSubtheme';
    public $reactRootView = 'public';
}



