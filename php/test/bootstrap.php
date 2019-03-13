<?php

/**
 * Combyna
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/combyna
 *
 * Released under the MIT license
 * https://github.com/combyna/combyna/raw/master/MIT-LICENSE.txt
 */

use Combyna\Harness\TestCombynaBootstrap;
use Symfony\Component\Filesystem\Filesystem;

// Load Composer's autoloader
$autoloader = require __DIR__ . '/../../vendor/autoload.php';

$autoloader->addPsr4('Combyna\\Harness\\', __DIR__ . '/../../vendor/combyna/combyna/php/test/Combyna/Harness');
$autoloader->addPsr4('Combyna\\Integrated\\', __DIR__ . '/../../vendor/combyna/combyna/php/test/Combyna/Integrated');
$autoloader->addPsr4('Combyna\\Plugin\\Gui\\Test\\', __DIR__);

$cachePath = __DIR__ . '/../dist';

// Make sure the cache is up-to-date for each test run
$fileSystem = new Filesystem();
$fileSystem->remove($cachePath);

$combynaBootstrap = new TestCombynaBootstrap();
$combynaBootstrap->configureContainer($cachePath);

$combynaBootstrap->warmUp();
