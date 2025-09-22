// CharacterManagement页面相关的API服务

// 角色管理服务
export const characterService = {
  // 获取所有角色
  async getAllCharacters() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 这里可以替换为真实的API调用
        resolve({
          success: true,
          data: [],
          message: '获取角色列表成功'
        })
      }, 300)
    })
  },

  // 创建角色
  async createCharacter(characterData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟验证
        if (!characterData.name || !characterData.avatar) {
          reject(new Error('角色名称和头像不能为空'))
          return
        }

        resolve({
          success: true,
          data: {
            id: Date.now(),
            ...characterData,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          message: '角色创建成功'
        })
      }, 500)
    })
  },

  // 更新角色
  async updateCharacter(id, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!id) {
          reject(new Error('角色ID不能为空'))
          return
        }

        resolve({
          success: true,
          data: {
            id,
            ...updates,
            updatedAt: new Date()
          },
          message: '角色更新成功'
        })
      }, 400)
    })
  },

  // 删除角色
  async deleteCharacter(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!id) {
          reject(new Error('角色ID不能为空'))
          return
        }

        resolve({
          success: true,
          data: { id },
          message: '角色删除成功'
        })
      }, 300)
    })
  },

  // 批量删除角色
  async batchDeleteCharacters(ids) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!ids || ids.length === 0) {
          reject(new Error('请选择要删除的角色'))
          return
        }

        resolve({
          success: true,
          data: { deletedIds: ids },
          message: `成功删除 ${ids.length} 个角色`
        })
      }, 600)
    })
  },

  // 导出角色数据
  async exportCharacters(format = 'json') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            format,
            downloadUrl: '/api/characters/export',
            filename: `characters_${new Date().toISOString().split('T')[0]}.${format}`
          },
          message: '角色数据导出成功'
        })
      }, 800)
    })
  },

  // 导入角色数据
  async importCharacters(file) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!file) {
          reject(new Error('请选择要导入的文件'))
          return
        }

        // 模拟文件解析
        const importedCount = Math.floor(Math.random() * 10) + 1
        
        resolve({
          success: true,
          data: {
            importedCount,
            skippedCount: 0,
            errors: []
          },
          message: `成功导入 ${importedCount} 个角色`
        })
      }, 1200)
    })
  }
}

// 角色验证服务
export const validationService = {
  // 验证角色名称
  validateName(name) {
    if (!name || name.trim().length === 0) {
      return { valid: false, message: '角色名称不能为空' }
    }
    if (name.length > 20) {
      return { valid: false, message: '角色名称不能超过20个字符' }
    }
    return { valid: true }
  },

  // 验证角色描述
  validateDescription(description) {
    if (!description || description.trim().length === 0) {
      return { valid: false, message: '角色描述不能为空' }
    }
    if (description.length > 200) {
      return { valid: false, message: '角色描述不能超过200个字符' }
    }
    return { valid: true }
  },

  // 验证标签
  validateTags(tags) {
    if (!tags || tags.length === 0) {
      return { valid: true } // 标签可以为空
    }
    if (tags.length > 10) {
      return { valid: false, message: '标签数量不能超过10个' }
    }
    for (const tag of tags) {
      if (tag.length > 10) {
        return { valid: false, message: '单个标签长度不能超过10个字符' }
      }
    }
    return { valid: true }
  },

  // 验证完整角色数据
  validateCharacter(characterData) {
    const nameValidation = this.validateName(characterData.name)
    if (!nameValidation.valid) return nameValidation

    const descValidation = this.validateDescription(characterData.description)
    if (!descValidation.valid) return descValidation

    const tagsValidation = this.validateTags(characterData.tags)
    if (!tagsValidation.valid) return tagsValidation

    if (!characterData.avatar) {
      return { valid: false, message: '请选择角色头像' }
    }

    if (!characterData.personality) {
      return { valid: false, message: '请输入角色性格' }
    }

    return { valid: true }
  }
}

// 角色统计服务
export const statsService = {
  // 获取角色统计数据
  async getCharacterStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalCharacters: Math.floor(Math.random() * 50) + 10,
            favoriteCharacters: Math.floor(Math.random() * 20) + 5,
            totalChats: Math.floor(Math.random() * 1000) + 100,
            activeCharacters: Math.floor(Math.random() * 30) + 5,
            averageChatsPerCharacter: Math.floor(Math.random() * 50) + 10
          }
        })
      }, 400)
    })
  },

  // 获取角色活跃度数据
  async getCharacterActivity() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const days = 7
        const data = Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          chats: Math.floor(Math.random() * 100) + 10,
          activeCharacters: Math.floor(Math.random() * 20) + 5
        }))

        resolve({
          success: true,
          data
        })
      }, 300)
    })
  }
}