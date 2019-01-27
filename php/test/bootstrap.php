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

// Load Composer's autoloader
$autoloader = require __DIR__ . '/../../vendor/autoload.php';

$autoloader->addPsr4('Combyna\\Harness\\', __DIR__ . '/../../vendor/combyna/combyna/php/test/Combyna/Harness');
$autoloader->addPsr4('Combyna\\Integrated\\', __DIR__ . '/../../vendor/combyna/combyna/php/test/Combyna/Integrated');
$autoloader->addPsr4('Combyna\\Plugin\\Gui\\Test\\', __DIR__);

$compiledContainerPath = __DIR__ . '/../dist/Combyna/Container/CompiledCombynaContainer.php';

if (file_exists($compiledContainerPath)) {
    // Make sure the compiled DI container is up-to-date for each test run
    unlink($compiledContainerPath);
}

// Make sure the expression parser is up-to-date for each test run
shell_exec('composer run-script build:expression-parser');

$combynaBootstrap = new TestCombynaBootstrap();
$combynaBootstrap->configureContainer($compiledContainerPath);
