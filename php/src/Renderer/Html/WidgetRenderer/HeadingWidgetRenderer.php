<?php

/**
 * Combyna base GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

namespace Combyna\Plugin\Gui\Renderer\Html\WidgetRenderer;

use Combyna\Component\Program\ProgramInterface;
use Combyna\Component\Renderer\Html\HtmlElement;
use Combyna\Component\Renderer\Html\RenderedWidget;
use Combyna\Component\Renderer\Html\WidgetRenderer\DelegatingWidgetRenderer;
use Combyna\Component\Renderer\Html\WidgetRenderer\WidgetRendererInterface;
use Combyna\Component\Ui\State\Widget\DefinedWidgetStateInterface;
use Combyna\Component\Ui\State\Widget\WidgetStateInterface;
use Combyna\Component\Ui\State\Widget\WidgetStatePathInterface;
use InvalidArgumentException;

/**
 * Class HeadingWidgetRenderer
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
class HeadingWidgetRenderer implements WidgetRendererInterface
{
    /**
     * @var DelegatingWidgetRenderer
     */
    private $delegatingWidgetRenderer;

    /**
     * @param DelegatingWidgetRenderer $delegatingWidgetRenderer
     */
    public function __construct(DelegatingWidgetRenderer $delegatingWidgetRenderer)
    {
        $this->delegatingWidgetRenderer = $delegatingWidgetRenderer;
    }

    /**
     * {@inheritdoc}
     */
    public function getWidgetDefinitionLibraryName()
    {
        return 'gui';
    }

    /**
     * {@inheritdoc}
     */
    public function getWidgetDefinitionName()
    {
        return 'heading';
    }

    /**
     * {@inheritdoc}
     */
    public function renderWidget(
        WidgetStateInterface $widgetState,
        WidgetStatePathInterface $widgetStatePath,
        ProgramInterface $program
    ) {
        if (
            !$widgetState instanceof DefinedWidgetStateInterface ||
            $widgetState->getWidgetDefinitionLibraryName() !== $this->getWidgetDefinitionLibraryName() ||
            $widgetState->getWidgetDefinitionName() !== $this->getWidgetDefinitionName()
        ) {
            throw new InvalidArgumentException('Heading widget renderer must receive a gui.heading widget');
        }

        $htmlAttributes = [];
        $childNode = $this->delegatingWidgetRenderer->renderWidget(
            $widgetStatePath->getChildStatePath('contents'),
            $program
        );

        return new RenderedWidget(
            $widgetState,
            new HtmlElement(
                'h' . $widgetState->getAttribute('level')->toNative(),
                $widgetStatePath->getWidgetStatePath(),
                $htmlAttributes,
                [$childNode]
            )
        );
    }
}
