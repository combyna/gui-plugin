<?php

/**
 * Combyna
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/combyna
 *
 * Released under the MIT license
 * https://github.com/combyna/combyna/raw/master/MIT-LICENSE.txt
 */

namespace Combyna\Plugin\Gui\Renderer\Html\WidgetRenderer;

use Combyna\Component\Renderer\Html\HtmlElement;
use Combyna\Component\Renderer\Html\RenderedWidget;
use Combyna\Component\Renderer\Html\WidgetRenderer\WidgetRendererInterface;
use Combyna\Component\Ui\State\Widget\DefinedWidgetStateInterface;
use Combyna\Component\Ui\State\Widget\WidgetStateInterface;
use Combyna\Component\Ui\State\Widget\WidgetStatePathInterface;
use InvalidArgumentException;

/**
 * Class EmptyWidgetRenderer
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
class EmptyWidgetRenderer implements WidgetRendererInterface
{
    /**
     * @var string
     */
    private $tagName;

    /**
     * @var string
     */
    private $widgetDefinitionName;

    /**
     * @var array
     */
    private $widgetToHtmlAttributeNameMap;

    /**
     * @param string $widgetDefinitionName
     * @param string $tagName
     * @param array $widgetToHtmlAttributeNameMap
     */
    public function __construct(
        $widgetDefinitionName,
        $tagName,
        array $widgetToHtmlAttributeNameMap = []
    ) {
        $this->tagName = $tagName;
        $this->widgetDefinitionName = $widgetDefinitionName;
        $this->widgetToHtmlAttributeNameMap = $widgetToHtmlAttributeNameMap;
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
    public function renderWidget(WidgetStateInterface $widgetState, WidgetStatePathInterface $widgetStatePath)
    {
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

        $htmlAttributes = [];

        foreach ($this->widgetToHtmlAttributeNameMap as $widgetAttributeName => $htmlAttributeName) {
            $htmlAttributes[$htmlAttributeName] = $widgetState->getAttribute($widgetAttributeName)->toNative();
        }

        return new RenderedWidget(
            $widgetState,
            new HtmlElement($this->tagName, $widgetStatePath->getWidgetStatePath(), $htmlAttributes)
        );
    }
}
