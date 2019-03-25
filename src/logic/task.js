module.exports = class extends think.Logic {
  indexAction() {
    if (this.ctx.isPost) {
      this.rules = {
        frequency: {
          required: true,
          string: true
        },
        name: {
          required: true,
          string: true
        },
        date: {
          required: true,
          string: true
        },
        taskList: {
          required: true,
          array: true,
          children: {
            object: true,
            required: true
          }
        }
      }
    }
  }
}
