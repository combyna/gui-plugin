<?php

/**
 * Combyna GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

use Combyna\Test\Harness\TestCombynaBootstrap;
use Symfony\Component\Filesystem\Filesystem;

// Load Composer's autoloader
$autoloader = require __DIR__ . '/../../vendor/autoload.php';

$autoloader->addPsr4('Combyna\\Harness\\', __DIR__ . '/../../vendor/combyna/combyna/php/test/Combyna/Harness');
$autoloader->addPsr4('Combyna\\Integrated\\', __DIR__ . '/../../vendor/combyna/combyna/php/test/Combyna/Integrated');
$autoloader->addPsr4('Combyna\\Plugin\\Gui\\Test\\', __DIR__);

$rootPath = __DIR__ . '/../..';
$relativeCachePath = 'php/dist';

// Make sure the cache is up-to-date for each test run
$fileSystem = new Filesystem();
$fileSystem->remove($rootPath . '/' . $relativeCachePath);

$combynaBootstrap = new TestCombynaBootstrap([], $rootPath, $relativeCachePath);

$combynaBootstrap->warmUp();
