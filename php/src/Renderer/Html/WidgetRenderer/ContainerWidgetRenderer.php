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
 * Class ContainerWidgetRenderer
 *
 * Used for any widget that is a container with additional semantics.
 * Examples are list items and navigation.
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
class ContainerWidgetRenderer implements WidgetRendererInterface
{
    /**
     * @var DelegatingWidgetRenderer
     */
    private $delegatingWidgetRenderer;

    /**
     * @var string
     */
    private $tagName;

    /**
     * @var string
     */
    private $widgetDefinitionName;

    /**
     * @param DelegatingWidgetRenderer $delegatingWidgetRenderer
     * @param string $widgetDefinitionName
     * @param string $tagName
     */
    public function __construct(
        DelegatingWidgetRenderer $delegatingWidgetRenderer,
        $widgetDefinitionName,
        $tagName
    ) {
        $this->delegatingWidgetRenderer = $delegatingWidgetRenderer;
        $this->tagName = $tagName;
        $this->widgetDefinitionName = $widgetDefinitionName;
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
        return $this->widgetDefinitionName;
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
            throw new InvalidArgumentException(sprintf(
                'Widget renderer must receive a gui.%s widget, got %s.%s',
                $this->widgetDefinitionName,
                $widgetState->getWidgetDefinitionLibraryName(),
                $widgetState->getWidgetDefinitionName()
            ));
        }

        $childNode = $this->delegatingWidgetRenderer->renderWidget(
            $widgetStatePath->getChildStatePath('contents'),
            $program
        );
        $htmlAttributes = [];

        return new RenderedWidget(
            $widgetState,
            new HtmlElement($this->tagName, $widgetStatePath->getWidgetStatePath(), $htmlAttributes, [$childNode])
        );
    }
}
