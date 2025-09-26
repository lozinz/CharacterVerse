/**
 * AudioWorklet 音频处理工具
 * 提供高性能的实时音频处理能力
 * 支持录音、音频效果、实时分析等功能
 */

class AudioWorkletRecorder {
  constructor(options = {}) {
    this.options = {
      sampleRate: 44100,
      channels: 1,
      bufferSize: 4096,
      enableEffects: true,
      enableAnalysis: true,
      ...options
    }
    
    this.audioContext = null
    this.mediaStream = null
    this.sourceNode = null
    this.workletNode = null
    this.analyserNode = null
    
    this.isRecording = false
    this.isPaused = false
    this.recordedChunks = []
    this.startTime = 0
    this.pausedDuration = 0
    
    // 音频分析数据
    this.volumeLevel = 0
    this.frequencyData = null
    this.waveformData = null
    this.analysisRunning = false
    
    // 事件回调
    this.onVolumeChange = options.onVolumeChange || null
    this.onFrequencyData = options.onFrequencyData || null
    this.onDataAvailable = options.onDataAvailable || null
    this.onError = options.onError || null
    this.onStateChange = options.onStateChange || null
    
    // 绑定方法
    this.handleWorkletMessage = this.handleWorkletMessage.bind(this)
  }

  /**
   * 初始化 AudioWorklet
   */
  async initialize() {
    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.options.sampleRate
      })

      // 加载 AudioWorklet 处理器
      await this.loadWorkletProcessor()
      
      // 获取麦克风权限
      await this.setupMicrophone()
      
      // 创建音频节点
      this.createAudioNodes()
      
      // 连接音频图
      this.connectAudioGraph()
      
      this.emitStateChange('initialized')
      return true
    } catch (error) {
      this.handleError('初始化失败', error)
      return false
    }
  }

  /**
   * 加载 AudioWorklet 处理器
   */
  async loadWorkletProcessor() {
    const processorCode = `
      class AudioRecorderProcessor extends AudioWorkletProcessor {
        constructor(options) {
          super()
          
          this.isRecording = false
          this.isPaused = false
          this.bufferSize = options.processorOptions?.bufferSize || 4096
          this.channels = options.processorOptions?.channels || 1
          
          // 音频缓冲区
          this.audioBuffer = []
          this.bufferLength = 0
          
          // 音频效果参数
          this.gain = 1.0
          this.noiseGate = {
            enabled: true, // 默认启用噪音门限
            threshold: 0.02, // 提高噪音门限阈值
            ratio: 0.05, // 降低噪音门限比例，更强的抑制
            attack: 0.003, // 攻击时间
            release: 0.1 // 释放时间
          }
          
          // 噪音抑制参数
          this.noiseReduction = {
            enabled: true,
            spectralFloor: 0.002, // 频谱底噪
            smoothingFactor: 0.8, // 平滑因子
            reductionFactor: 0.7 // 噪音减少因子
          }
          
          // 动态范围压缩
          this.compressor = {
            enabled: true,
            threshold: 0.7, // 压缩阈值
            ratio: 4, // 压缩比
            attack: 0.003,
            release: 0.1
          }
          
          // 监听主线程消息
          this.port.onmessage = this.handleMessage.bind(this)
        }
        
        handleMessage(event) {
          const { type, data } = event.data
          
          switch (type) {
            case 'start':
              this.isRecording = true
              this.isPaused = false
              this.audioBuffer = []
              this.bufferLength = 0
              break
              
            case 'pause':
              this.isPaused = true
              break
              
            case 'resume':
              this.isPaused = false
              break
              
            case 'stop':
              this.isRecording = false
              this.isPaused = false
              // 发送最终音频数据
              this.sendAudioData(true)
              break
              
            case 'setGain':
              this.gain = data.gain
              break
              
            case 'setNoiseGate':
              this.noiseGate = { ...this.noiseGate, ...data }
              break
          }
        }
        
        process(inputs, outputs, parameters) {
          const input = inputs[0]
          const output = outputs[0]
          
          if (!input || input.length === 0) return true
          
          const inputChannel = input[0]
          const outputChannel = output[0]
          
          // 处理音频数据
          if (this.isRecording && !this.isPaused) {
            const processedData = this.processAudioData(inputChannel)
            
            // 添加到缓冲区
            this.audioBuffer.push(...processedData)
            this.bufferLength += processedData.length
            
            // 当缓冲区达到指定大小时发送数据
            if (this.bufferLength >= this.bufferSize) {
              this.sendAudioData(false)
            }
            
            // 计算音量
            const volume = this.calculateVolume(processedData)
            this.port.postMessage({
              type: 'volume',
              data: { volume }
            })
          }
          
          // 输出处理后的音频（用于监听）
          if (outputChannel) {
            for (let i = 0; i < inputChannel.length; i++) {
              outputChannel[i] = inputChannel[i] * this.gain
            }
          }
          
          return true
        }
        
        processAudioData(inputData) {
          let processedData = new Float32Array(inputData)
          
          // 1. 高通滤波器 - 去除低频噪音
          processedData = this.applyHighPassFilter(processedData)
          
          // 2. 噪音门限处理
          if (this.noiseGate.enabled) {
            processedData = this.applyNoiseGate(processedData)
          }
          
          // 3. 动态范围压缩
          if (this.compressor.enabled) {
            processedData = this.applyCompressor(processedData)
          }
          
          // 4. 应用增益
          if (this.gain !== 1.0) {
            for (let i = 0; i < processedData.length; i++) {
              processedData[i] *= this.gain
            }
          }
          
          // 5. 防削波处理
          for (let i = 0; i < processedData.length; i++) {
            if (processedData[i] > 1.0) processedData[i] = 1.0
            if (processedData[i] < -1.0) processedData[i] = -1.0
          }
          
          return processedData
        }
        
        // 高通滤波器实现
        applyHighPassFilter(data) {
          if (!this.highPassState) {
            this.highPassState = { x1: 0, y1: 0 }
          }
          
          const cutoff = 80 // 80Hz 截止频率，去除低频噪音
          const RC = 1.0 / (cutoff * 2 * Math.PI)
          const dt = 1.0 / sampleRate
          const alpha = RC / (RC + dt)
          
          const filtered = new Float32Array(data.length)
          
          for (let i = 0; i < data.length; i++) {
            filtered[i] = alpha * (this.highPassState.y1 + data[i] - this.highPassState.x1)
            this.highPassState.x1 = data[i]
            this.highPassState.y1 = filtered[i]
          }
          
          return filtered
        }
        
        // 改进的噪音门限
        applyNoiseGate(data) {
          const filtered = new Float32Array(data.length)
          
          for (let i = 0; i < data.length; i++) {
            const amplitude = Math.abs(data[i])
            
            if (amplitude < this.noiseGate.threshold) {
              // 软门限：渐进式衰减而不是硬切断
              const ratio = Math.pow(amplitude / this.noiseGate.threshold, 2)
              filtered[i] = data[i] * ratio * this.noiseGate.ratio
            } else {
              filtered[i] = data[i]
            }
          }
          
          return filtered
        }
        
        // 动态范围压缩器
        applyCompressor(data) {
          if (!this.compressorState) {
            this.compressorState = { envelope: 0 }
          }
          
          const filtered = new Float32Array(data.length)
          
          for (let i = 0; i < data.length; i++) {
            const amplitude = Math.abs(data[i])
            
            // 包络跟踪
            const targetEnv = amplitude
            if (targetEnv > this.compressorState.envelope) {
              this.compressorState.envelope += (targetEnv - this.compressorState.envelope) * this.compressor.attack
            } else {
              this.compressorState.envelope += (targetEnv - this.compressorState.envelope) * this.compressor.release
            }
            
            // 压缩计算
            let gain = 1.0
            if (this.compressorState.envelope > this.compressor.threshold) {
              const excess = this.compressorState.envelope - this.compressor.threshold
              const compressedExcess = excess / this.compressor.ratio
              gain = (this.compressor.threshold + compressedExcess) / this.compressorState.envelope
            }
            
            filtered[i] = data[i] * gain
          }
          
          return filtered
        }
        
        calculateVolume(audioData) {
          let sum = 0
          for (let i = 0; i < audioData.length; i++) {
            sum += audioData[i] * audioData[i]
          }
          const rms = Math.sqrt(sum / audioData.length)
          return Math.min(rms * 10, 1.0) // 归一化到 0-1
        }
        
        sendAudioData(isFinal = false) {
          if (this.audioBuffer.length > 0) {
            this.port.postMessage({
              type: 'audioData',
              data: {
                audioData: this.audioBuffer.slice(),
                isFinal,
                sampleRate: sampleRate,
                channels: this.channels
              }
            })
            
            // 清空缓冲区
            this.audioBuffer = []
            this.bufferLength = 0
          }
        }
      }
      
      registerProcessor('audio-recorder-processor', AudioRecorderProcessor)
    `
    
    const blob = new Blob([processorCode], { type: 'application/javascript' })
    const processorUrl = URL.createObjectURL(blob)
    
    await this.audioContext.audioWorklet.addModule(processorUrl)
    URL.revokeObjectURL(processorUrl)
  }

  /**
   * 设置麦克风
   */
  async setupMicrophone() {
    const constraints = {
      audio: {
        sampleRate: this.options.sampleRate,
        channelCount: this.options.channels,
        echoCancellation: true, // 回声消除
        noiseSuppression: true, // 噪音抑制
        autoGainControl: true, // 启用自动增益控制，有助于稳定音量
        googEchoCancellation: true, // Google 回声消除
        googAutoGainControl: true, // Google 自动增益控制
        googNoiseSuppression: true, // Google 噪音抑制
        googHighpassFilter: true, // 高通滤波器，过滤低频噪音
        googTypingNoiseDetection: true, // 键盘噪音检测
        googAudioMirroring: false // 禁用音频镜像
      }
    }
    
    this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
  }

  /**
   * 创建音频节点
   */
  createAudioNodes() {
    // 创建源节点
    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream)
    
    // 创建 AudioWorklet 节点
    this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-recorder-processor', {
      processorOptions: {
        bufferSize: this.options.bufferSize,
        channels: this.options.channels
      }
    })
    
    // 监听 worklet 消息
    this.workletNode.port.onmessage = this.handleWorkletMessage
    
    // 创建分析节点（可选）
    if (this.options.enableAnalysis) {
      this.analyserNode = this.audioContext.createAnalyser()
      this.analyserNode.fftSize = 2048
      this.analyserNode.smoothingTimeConstant = 0.8
      
      this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount)
      this.waveformData = new Uint8Array(this.analyserNode.fftSize)
    }
  }

  /**
   * 连接音频图
   */
  connectAudioGraph() {
    // 基本连接：麦克风 -> WorkletNode
    this.sourceNode.connect(this.workletNode)
    
    // 如果启用分析，添加分析节点
    if (this.analyserNode) {
      this.sourceNode.connect(this.analyserNode)
    }
    
    // WorkletNode 连接到目标（用于监听，可选）
    // this.workletNode.connect(this.audioContext.destination)
  }

  /**
   * 处理 WorkletNode 消息
   */
  handleWorkletMessage(event) {
    const { type, data } = event.data
    
    switch (type) {
      case 'volume':
        this.volumeLevel = data.volume
        if (this.onVolumeChange) {
          this.onVolumeChange(data.volume)
        }
        break
        
      case 'audioData':
        this.recordedChunks.push(data)
        
        // 调用 onDataAvailable 回调
        if (this.onDataAvailable && data.audioData) {
          // 将音频数据转换为 WAV 格式
          const wavBuffer = this.encodeWAVChunk(data.audioData, data.sampleRate || this.options.sampleRate, data.channels || this.options.channels)
          this.onDataAvailable(wavBuffer)
        }
        break
        
      case 'error':
        this.handleError('WorkletNode 错误', data.error)
        break
    }
  }

  /**
   * 开始录音
   */
  async startRecording() {
    if (!this.audioContext || !this.workletNode) {
      throw new Error('AudioWorklet 未初始化')
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    
    this.isRecording = true
    this.isPaused = false
    this.recordedChunks = []
    this.startTime = Date.now()
    this.pausedDuration = 0
    
    // 发送开始录音消息到 WorkletNode
    this.workletNode.port.postMessage({ type: 'start' })
    
    // 开始音频分析
    if (this.options.enableAnalysis) {
      this.startAnalysis()
    }
    
    this.emitStateChange('recording')
  }

  /**
   * 暂停录音
   */
  pauseRecording() {
    if (!this.isRecording || this.isPaused) return
    
    this.isPaused = true
    this.pauseStartTime = Date.now()
    
    this.workletNode.port.postMessage({ type: 'pause' })
    this.emitStateChange('paused')
  }

  /**
   * 恢复录音
   */
  resumeRecording() {
    if (!this.isRecording || !this.isPaused) return
    
    this.isPaused = false
    this.pausedDuration += Date.now() - this.pauseStartTime
    
    this.workletNode.port.postMessage({ type: 'resume' })
    this.emitStateChange('recording')
  }

  /**
   * 停止录音
   */
  async stopRecording() {
    if (!this.isRecording) return null
    
    this.isRecording = false
    this.isPaused = false
    
    // 发送停止消息到 WorkletNode
    this.workletNode.port.postMessage({ type: 'stop' })
    
    // 停止音频分析
    this.stopAnalysis()
    
    // 等待最后的音频数据
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 生成音频文件
    const audioBlob = this.createAudioBlob()
    
    this.emitStateChange('stopped')
    return audioBlob
  }

  /**
   * 创建音频 Blob
   */
  createAudioBlob() {
    if (this.recordedChunks.length === 0) return null
    
    // 合并所有音频数据
    let totalLength = 0
    this.recordedChunks.forEach(chunk => {
      totalLength += chunk.audioData.length
    })
    
    const mergedData = new Float32Array(totalLength)
    let offset = 0
    
    this.recordedChunks.forEach(chunk => {
      mergedData.set(chunk.audioData, offset)
      offset += chunk.audioData.length
    })
    
    // 转换为 WAV 格式
    const wavBuffer = this.encodeWAV(mergedData, this.options.sampleRate, this.options.channels)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }

  /**
   * 编码单个音频块为 WAV 格式
   */
  encodeWAVChunk(audioData, sampleRate, channels) {
    const length = audioData.length
    const buffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(buffer)
    
    // WAV 文件头
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + length * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * channels * 2, true)
    view.setUint16(32, channels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, length * 2, true)
    
    // 音频数据
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]))
      view.setInt16(offset, sample * 0x7FFF, true)
      offset += 2
    }
    
    return buffer
  }

  /**
   * 编码为 WAV 格式（完整文件）
   */
  encodeWAV(audioData, sampleRate, channels) {
    const length = audioData.length
    const buffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(buffer)
    
    // WAV 文件头
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + length * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * channels * 2, true)
    view.setUint16(32, channels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, length * 2, true)
    
    // 音频数据
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]))
      view.setInt16(offset, sample * 0x7FFF, true)
      offset += 2
    }
    
    return buffer
  }

  /**
   * 开始音频分析
   */
  startAnalysis() {
    if (!this.analyserNode) return
    
    console.log('📊 开始音频分析')
    this.analysisRunning = true
    
    const analyze = () => {
      if (!this.analysisRunning) return
      
      // 获取频域数据
      this.analyserNode.getByteFrequencyData(this.frequencyData)
      
      // 获取时域数据
      this.analyserNode.getByteTimeDomainData(this.waveformData)
      
      // console.log('📈 分析数据 - 频域:', this.frequencyData.slice(0, 10), '时域:', this.waveformData.slice(0, 10))
      
      // 发送分析数据
      if (this.onFrequencyData) {
        this.onFrequencyData({
          frequency: Array.from(this.frequencyData),
          waveform: Array.from(this.waveformData)
        })
      }
      
      // 继续分析
      if (this.analysisRunning) {
        requestAnimationFrame(analyze)
      }
    }
    
    analyze()
  }

  /**
   * 停止音频分析
   */
  stopAnalysis() {
    console.log('📊 停止音频分析')
    this.analysisRunning = false
  }

  /**
   * 设置音频增益
   */
  setGain(gain) {
    if (this.workletNode) {
      this.workletNode.port.postMessage({
        type: 'setGain',
        data: { gain }
      })
    }
  }

  /**
   * 设置噪声门限
   */
  setNoiseGate(enabled, threshold = 0.01, ratio = 0.1) {
    if (this.workletNode) {
      this.workletNode.port.postMessage({
        type: 'setNoiseGate',
        data: { enabled, threshold, ratio }
      })
    }
  }

  /**
   * 获取录音时长
   */
  getRecordingDuration() {
    if (!this.isRecording) return 0
    
    const now = Date.now()
    const totalTime = now - this.startTime
    const actualTime = totalTime - this.pausedDuration
    
    if (this.isPaused) {
      return actualTime - (now - this.pauseStartTime)
    }
    
    return actualTime
  }

  /**
   * 获取音频设备列表
   */
  static async getAudioDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter(device => device.kind === 'audioinput')
    } catch (error) {
      console.error('获取音频设备失败:', error)
      return []
    }
  }

  /**
   * 切换音频设备
   */
  async switchAudioDevice(deviceId) {
    try {
      // 停止当前流
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop())
      }
      
      // 使用新设备创建流
      const constraints = {
        audio: {
          deviceId: { exact: deviceId },
          sampleRate: this.options.sampleRate,
          channelCount: this.options.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      }
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // 重新连接源节点
      if (this.sourceNode) {
        this.sourceNode.disconnect()
      }
      
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream)
      this.connectAudioGraph()
      
      return true
    } catch (error) {
      this.handleError('切换音频设备失败', error)
      return false
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    // 停止录音
    if (this.isRecording) {
      this.stopRecording()
    }
    
    // 停止媒体流
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
    }
    
    // 断开音频节点
    if (this.sourceNode) {
      this.sourceNode.disconnect()
    }
    
    if (this.workletNode) {
      this.workletNode.disconnect()
    }
    
    if (this.analyserNode) {
      this.analyserNode.disconnect()
    }
    
    // 关闭音频上下文
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
    }
    
    // 清理数据
    this.recordedChunks = []
    this.frequencyData = null
    this.waveformData = null
    
    this.emitStateChange('cleaned')
  }

  /**
   * 错误处理
   */
  handleError(message, error) {
    console.error(message, error)
    if (this.onError) {
      this.onError(new Error(`${message}: ${error.message || error}`))
    }
  }

  /**
   * 发送状态变化事件
   */
  emitStateChange(state) {
    if (this.onStateChange) {
      this.onStateChange(state, {
        isRecording: this.isRecording,
        isPaused: this.isPaused,
        duration: this.getRecordingDuration(),
        volume: this.volumeLevel
      })
    }
  }

  // Getter 方法
  get state() {
    if (!this.audioContext) return 'uninitialized'
    if (this.isRecording && this.isPaused) return 'paused'
    if (this.isRecording) return 'recording'
    return 'ready'
  }

  get volume() {
    return this.volumeLevel
  }

  get duration() {
    return this.getRecordingDuration()
  }

  get isInitialized() {
    return !!this.audioContext && !!this.workletNode
  }

  /**
   * 获取音频流
   */
  getAudioStream() {
    return this.mediaStream
  }
}

export default AudioWorkletRecorder
export { AudioWorkletRecorder }