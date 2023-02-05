import React, { ReactEventHandler } from 'react'
import classnames from 'classnames'
import { StreamWithURL } from '../reducers/streams'
import { Dropdown } from './Dropdown'
import { WindowState } from '../reducers/windowStates'
import { MaximizeParams, MinimizeTogglePayload } from '../actions/StreamActions'
import { MdCrop, MdZoomIn, MdZoomOut, MdMenu } from 'react-icons/md'

import VUMeter from './VUMeter'
import VideoSrc from './VideoSrc'

export interface VideoProps {
  onMaximize: (payload: MaximizeParams) => void
  onMinimizeToggle: (payload: MinimizeTogglePayload) => void
  nickname: string
  windowState: WindowState
  stream?: StreamWithURL
  peerId: string
  muted: boolean
  mirrored: boolean
  play: () => void
  localUser?: boolean
  style?: React.CSSProperties
}

export interface VideoState {
  objectFit: string
}

export default class Video
extends React.PureComponent<VideoProps, VideoState> {
  videoRef = React.createRef<HTMLVideoElement>()

  state = {
    objectFit: '',
  }

  static defaultProps = {
    muted: false,
    mirrored: false,
  }
  handleClick: ReactEventHandler<HTMLVideoElement> = () => {
    this.props.play()
  }
  // componentDidMount () {
  //   this.componentDidUpdate()
  // }
  // componentDidUpdate () {
  //   const { stream } = this.props
  //   const video = this.videoRef.typescurrent
  //   if (video) {
  //     const mediaStream = stream && stream.stream || null
  //     const url = stream && stream.url
  //     if ('srcObject' in video as unknown) {
  //       if (video.srcObject !== mediaStream) {
  //         video.srcObject = mediaStream
  //       }
  //     } else if (video.src !== url) {
  //       video.src = url || ''
  //     }
  //     video.muted = this.props.muted
  //   }
  // }
  handleMinimize = () => {
    this.props.onMinimizeToggle({
      peerId: this.props.peerId,
      streamId: this.props.stream && this.props.stream.streamId,
    })
  }
  handleMaximize = () => {
    this.props.onMaximize({
      peerId: this.props.peerId,
      streamId: this.props.stream && this.props.stream.streamId,
    })
  }
  handleToggleCover = () => {
    this.setState({
      objectFit: this.state.objectFit ? '' : 'contain',
    })
  }
  render () {
    const { mirrored, peerId, windowState, stream } = this.props
    const { objectFit } = this.state
    const minimized =  windowState === 'minimized'
    const className = classnames('video-container', {
      minimized,
      mirrored,
    })

    const streamId = stream && stream.streamId
    const mediaStream = stream && stream.stream || null
    const streamURL = stream && stream.url || ''

    return (
      <div className={className} style={this.props.style}>
        <VideoSrc
          id={`video-${peerId}`}
          autoPlay
          onClick={this.handleClick}
          onLoadedMetadata={() => this.props.play()}
          muted={this.props.muted}
          objectFit={objectFit}
          srcObject={mediaStream}
          src={streamURL}
        />
        <div className='video-footer'>
          <VUMeter streamId={streamId} />
          <span className='nickname'>{this.props.nickname}</span>
          <Dropdown fixed label={<MdMenu />}>
            <li className='action-maximize' onClick={this.handleMaximize}>
              <MdZoomIn />&nbsp;
              Maximize
            </li>
            <li className='action-minimize' onClick={this.handleMinimize}>
              {minimized ? <MdZoomIn /> : <MdZoomOut /> }&nbsp;
              Toggle Minimize
            </li>
            <li className='action-toggle-fit' onClick={this.handleToggleCover}>
              <MdCrop /> Toggle Fit
            </li>
          </Dropdown>
        </div>
      </div>
    )
  }
}
