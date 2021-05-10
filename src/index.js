import React, { useState,Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { Button, Paragraph, Typography, SkeletonImage, SkeletonContainer, SkeletonDisplayText, SkeletonBodyText,FormLabel,TextInput,Heading,Subheading,List,ListItem, SkeletonText } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens'
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { css } from 'emotion'

import { MARKS,BLOCKS,INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';


const styles = {
  dialog: css({
    margin: tokens.spacingL
  })
}

const Bold = ({ children }) => <b>{children}</b>;
const Italic = ({ children }) => <em>{children}</em>;
const Underline = ({ children }) => <u>{children}</u>;

export class Code extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      code: null
    }
  }

  async componentDidMount() {
    const code = this.props.code//await this.props.sdk.space.getAsset(this.props.assetId)
    
    this.setState({code})
  }

  render() {
    if (this.state.code) {
      return <React.Fragment>
      <FormLabel htmlFor="name">Code example</FormLabel>
      <TextInput
        name="name"
        value={this.state.code}
        className="f36-margin-bottom--xs"
      />
      
    </React.Fragment>
    }

    return <SkeletonContainer><SkeletonImage width={750} height={100} /></SkeletonContainer>
  }
}
export class BlockEntry extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    entryId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      entry: null
    }
  }

  async componentDidMount() {
    const entry = await this.props.sdk.space.getEntry(this.props.entryId)
    this.setState({entry})
  }

  render() {
    if (this.state.entry) {
      // console.log(this.state.entry.fields["title"][this.props.sdk.locales.default])
      return <React.Fragment>
      <FormLabel htmlFor="name">Entry Title Render</FormLabel>
      <TextInput
        name="name"
        value={this.state.entry.fields["title"][this.props.sdk.locales.default]}
        className="f36-margin-bottom--xs"
      />
      
    </React.Fragment>
    }

    return <SkeletonContainer><SkeletonText /></SkeletonContainer>
  }
}
export class BlockAsset extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    assetId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      asset: null
    }
  }

  async componentDidMount() {
    const asset = await this.props.sdk.space.getAsset(this.props.assetId)
    this.setState({asset})
  }

  render() {
    if (this.state.asset) {
      return <img alt="" src={this.state.asset.fields.file[this.props.sdk.locales.default].url + '?w=750'} />
    }

    return <SkeletonContainer><SkeletonImage width={750} height={100} /></SkeletonContainer>
  }
}

export class EmbeddedEntry extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    entryId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      entry: null
    }
  }

  async componentDidMount() {
    const entry = await this.props.sdk.space.getEntry(this.props.entryId)
    this.setState({entry})
  }

  render() {
    if (this.state.entry) {
      return <span>**{this.state.entry.fields["title"][this.props.sdk.locales.default]}**</span>
      
    }
    return <SkeletonContainer><SkeletonText /></SkeletonContainer>
  }
}

export class Hyperlink extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    entryId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      entry: null
    }
  }

  async componentDidMount() {
    const entry = await this.props.sdk.space.getEntry(this.props.entryId)
    this.setState({entry})
  }

  render() {
    if (this.state.entry) {
      return <span>**{this.state.entry.fields["title"][this.props.sdk.locales.default]}**</span>
      
    }
    return <SkeletonContainer><SkeletonText /></SkeletonContainer>
  }
}

export class SidebarExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.emptyValue = {label: "Not selected", value: undefined}
    
    this.state = {
      contentType: props.sdk.contentType,
      fields: [],
      fieldOptions: [],
      selectedFieldType: this.emptyValue
    }

    this.onButtonClick = this.onButtonClick.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onMenuOpen = this.onMenuOpen.bind(this)
    this.onMenuClose = this.onMenuClose.bind(this)
  }

  async componentDidMount() {
    this.props.sdk.window.startAutoResizer()

     const fields = (await this.props.sdk.space.getContentType(this.props.sdk.ids.contentType)).fields

    const fieldOptions = (fields || []).map((ct) => {
       if (ct.type == "RichText") {
        return {value: ct.id, label: ct.name}
       } else {
         return this.emptyValue;
       }
    })
     fieldOptions.unshift(this.emptyValue)

     this.setState({fields, fieldOptions})

  }

  

  async onButtonClick() {
    
    const result = await this.props.sdk.dialogs.openExtension({
      width: 800,
      title: this.state.contentType.name + ' - Help',
      parameters: { contentTypeId: this.props.sdk.ids.contentType,entryId: this.props.sdk.ids.entry,fieldId: this.state.selectedFieldType }
    })
    console.log(result)
  }

  async onSelect(selectedField) {
    this.setState({selectedFieldType: selectedField.value})
  }

  onMenuOpen() {
    this.props.sdk.window.updateHeight(500)
  }

  onMenuClose() {
    this.props.sdk.window.updateHeight(50)
  }

  selectedFieldOption() {
    return (
      this.state.fieldOptions.find(ct => ct.value === this.state.selectedFieldType) ||
      this.emptyValue
    )
  }

  render() {
    return (
      <React.Fragment>
      <Select
        options={this.state.fieldOptions}
        value={this.selectedFieldOption()}
        onChange={this.onSelect}
        onMenuOpen={this.onMenuOpen}
        onMenuClose={this.onMenuClose}
      /><>

        <Paragraph>{this.state.contentType.description}</Paragraph>
        <Button
          buttonType="positive"
          isFullWidth={true}
          testId="open-dialog"
          onClick={this.onButtonClick}>
          Display more help
        </Button>
      </>
      </React.Fragment>
    )
  }
}

export class DialogExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      entry: undefined,
      loading: true
    }
  }

  async componentDidMount() {
    this.props.sdk.window.startAutoResizer()
    
    let entry
    try {
         
       entry = (await this.props.sdk.space.getEntry(this.props.sdk.parameters.invocation.entryId)).
        fields[this.props.sdk.parameters.invocation.fieldId][this.props.sdk.locales.default]

    } catch(err) {
      console.log('could not fetch help text')
    }
    
    this.setState({entry, loading: false})
  }

  render() {
    if (this.state.loading) return (
      <SkeletonContainer className={styles.dialog}>
        <SkeletonDisplayText numberOfLines={1} offsetTop={10} />
        <SkeletonBodyText numberOfLines={3} offsetTop={45} />
      </SkeletonContainer>
    )

    try {
      
      return (
        <Typography className={styles.dialog}>{
          documentToReactComponents(
            this.state.entry,
            {
              renderMark: {
                [MARKS.BOLD]: text => <Bold>{text}</Bold>,
                [MARKS.ITALIC]: text => <Italic>{text}</Italic>,
                [MARKS.UNDERLINE]: text => <Underline>{text}</Underline>,
                [MARKS.CODE]: text => {
                  try {
                    // const id = node.data.target.sys.id
                    return <Code code={text} sdk={this.props.sdk} />
                  } catch(err) { console.log(err) }
                }
              },
              renderNode: {
                [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
                [BLOCKS.HEADING_1]: (node,children) => <Heading>{children}</Heading>,
                [BLOCKS.HEADING_2]: (conde,children) => <Subheading>{children}</Subheading>,
                [BLOCKS.UL_LIST]: (node,children) => <List element="ul">{children}</List>,
                // [BLOCKS.OL_LIST]: (node,children) => <List element="ol">{children}</List>,
                [BLOCKS.EMBEDDED_ENTRY]: node => {
                  try {
                    const id = node.data.target.sys.id
                    return <BlockEntry entryId={id} sdk={this.props.sdk} />
                  } catch(err) { console.log(err) }
                },
                [BLOCKS.EMBEDDED_ASSET]: node => {
                  try {
                    const id = node.data.target.sys.id
                    return <BlockAsset assetId={id} sdk={this.props.sdk} />
                  } catch(err) { console.log(err) }
                },
                [INLINES.EMBEDDED_ENTRY]: node => {
                  try {
                    const id = node.data.target.sys.id
                    return <EmbeddedEntry entryId={id} sdk={this.props.sdk} />
                  } catch(err) { console.log(err) }
                }
              }
            }
          )
        }</Typography>
      )
    } catch(err) {
      console.log(err)
      return <Paragraph className={styles.dialog}><i>No help was found for this content type...</i></Paragraph>
    }
  }
}


init((sdk) => {
  sdk.window.startAutoResizer();
  
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    
    ReactDOM.render(<DialogExtension sdk={sdk} />, document.getElementById('root'));

  } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)){
    ReactDOM.render(<SidebarExtension sdk={sdk} />, document.getElementById('root')); 
  } 
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
