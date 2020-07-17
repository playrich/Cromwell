import { getStoreItem, TBlockDestinationPositionType, TCromwellBlockData, TCromwellBlockProps } from '@cromwell/core';
import React, { Component } from 'react';
import { CContainer } from '../ContainerBlock/CContainer';
import { CText } from '../TextBlock/CText';
import { CHTML } from '../HTMLBlock/CHTML';
import { CImage } from '../ImageBlock/CImage';
import { CPlugin } from '../PluginBlock/CPlugin';
import { CGallery } from '../GalleryBlock/CGallery';
import { cromwellBlockTypeToClassname, cromwellIdToHTML } from '../../constants';
//@ts-ignore
import styles from './CromwellBlock.module.scss';


export class CromwellBlock extends Component<TCromwellBlockProps> {

    private data?: TCromwellBlockData;
    // private blockRef: React.RefObject<HTMLDivElement> = React.createRef();
    private virtualBlocks: TCromwellBlockData[] = [];
    private id: string;

    constructor(props: TCromwellBlockProps) {
        super(props);

    }

    private readConfig = () => {
        this.data = undefined;
        this.virtualBlocks = [];

        if (this.props.type) this.data = { componentId: this.props.id, type: this.props.type };

        this.id = cromwellIdToHTML(this.props.id);

        const pageConfig = getStoreItem('pageConfig');
        // console.log('pageConfig', pageConfig)
        if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
            pageConfig.modifications.forEach(d => {
                if (d.componentId == this.props.id) {
                    this.data = d;
                }
                if (this.props.id == d.destinationComponentId && d.componentId && d.destinationPosition) {
                    // Save virtual (existing only in config) blocks that targeted at this component.
                    // This component will draw them
                    if (d.isVirtual) this.virtualBlocks.push(d)
                }
            })
        }

        if (this.data && !this.data.isDeleted) {


        }
    }

    private getVirtualBlocks = (postion: TBlockDestinationPositionType): JSX.Element[] => {
        return this.virtualBlocks.filter(b => b.destinationPosition === postion)
            .map(b => {
                if (b.type === 'HTML') {
                    return <CHTML
                        id={b.componentId}
                        key={b.componentId}
                    />
                }
                if (b.type === 'image') {
                    return <CImage
                        id={b.componentId}
                        key={b.componentId}
                    />
                }
                if (b.type === 'container') {
                    return <CContainer
                        id={b.componentId}
                        key={b.componentId}
                    />
                }
                if (b.type === 'text') {
                    return <CText
                        id={b.componentId}
                        key={b.componentId}
                    />
                }
                if (b.type === 'gallery') {
                    return <CGallery
                        id={b.componentId}
                        key={b.componentId}
                    />
                }
                if (b.type === 'plugin') {
                    return <CPlugin
                        id={b.componentId}
                        key={b.componentId}
                    />
                }

                return (
                    <CromwellBlock
                        id={b.componentId}
                        key={b.componentId}
                    />
                )
            })
    }

    render(): JSX.Element | null {
        this.readConfig();

        // console.log('CromwellBlock::render id: ' + this.id + ' data: ' + JSON.stringify(this.data));
        if (this.data && this.data.isDeleted) {
            return <></>;
        }

        // if (cromwellIdToHTML(this.props.id) !== this.id) {
        //     return <div style={{ color: 'red' }}>Error. Block id was changed between renders</div>
        // }

        const elementClassName = styles.CromwellBlock
            // + (this.shouldBeMoved && isServer() ? ' CromwellBlockInnerServer' : '')
            + (this.data && this.data.type ? ' ' + cromwellBlockTypeToClassname(this.data.type) : '')
            + (this.props.className ? ` ${this.props.className}` : '');

        let blockContent: React.ReactNode | null = this.props.children;

        const ContentComp = this.props.content;
        if (ContentComp) {
            blockContent = <ContentComp data={this.data} />
        }


        let element = (
            <div id={this.id} key={this.id}
                // @TODO resolve styles type to store in config. Normal CSS or React.CSSProperties
                // style={this.data ? this.data.styles as any : undefined}
                className={elementClassName}
            // ref={this.blockRef}
            >
                {blockContent}
                {this.getVirtualBlocks('inside')}
            </div>
        );

        return (
            <>
                {this.getVirtualBlocks('before')}
                {element}
                {this.getVirtualBlocks('after')}
            </>
        )

    }
}
