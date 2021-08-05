'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = exports.VXETablePluginVirtualTree = void 0

var _xeUtils = _interopRequireDefault(require('xe-utils'))

var _vxeTable = require('vxe-table')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { 'default': obj } }

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function hasChilds (_vm, row) {
  var childList = row[_vm.treeOpts.children]
  return childList && childList.length
}

function renderDefaultForm (h, _vm) {
  var proxyConfig = _vm.proxyConfig
  var proxyOpts = _vm.proxyOpts
  var formData = _vm.formData
  var formConfig = _vm.formConfig
  var formOpts = _vm.formOpts

  if (formConfig && formOpts.items && formOpts.items.length) {
    if (!formOpts.inited) {
      formOpts.inited = true
      var beforeItem = proxyOpts.beforeItem

      if (proxyOpts && beforeItem) {
        formOpts.items.forEach(function (item) {
          beforeItem.call(_vm, {
            $grid: _vm,
            item: item
          })
        })
      }
    }

    return [h('vxe-form', {
      props: Object.assign({}, formOpts, {
        data: proxyConfig && proxyOpts.form ? formData : formOpts.data
      }),
      on: {
        submit: _vm.submitEvent,
        reset: _vm.resetEvent,
        'submit-invalid': _vm.submitInvalidEvent,
        'toggle-collapse': _vm.togglCollapseEvent
      },
      ref: 'form'
    })]
  }

  return []
}

function getToolbarSlots (_vm) {
  var $scopedSlots = _vm.$scopedSlots
  var toolbarOpts = _vm.toolbarOpts
  var toolbarOptSlots = toolbarOpts.slots
  var $buttons
  var $tools
  var slots = {}

  if (toolbarOptSlots) {
    $buttons = toolbarOptSlots.buttons
    $tools = toolbarOptSlots.tools

    if ($buttons && $scopedSlots[$buttons]) {
      $buttons = $scopedSlots[$buttons]
    }

    if ($tools && $scopedSlots[$tools]) {
      $tools = $scopedSlots[$tools]
    }
  }

  if ($buttons) {
    slots.buttons = $buttons
  }

  if ($tools) {
    slots.tools = $tools
  }

  return slots
}

function getPagerSlots (_vm) {
  var $scopedSlots = _vm.$scopedSlots
  var pagerOpts = _vm.pagerOpts
  var pagerOptSlots = pagerOpts.slots
  var slots = {}
  var $left
  var $right

  if (pagerOptSlots) {
    $left = pagerOptSlots.left
    $right = pagerOptSlots.right

    if ($left && $scopedSlots[$left]) {
      $left = $scopedSlots[$left]
    }

    if ($right && $scopedSlots[$right]) {
      $right = $scopedSlots[$right]
    }
  }

  if ($left) {
    slots.left = $left
  }

  if ($right) {
    slots.right = $right
  }

  return slots
}

function getTableOns (_vm) {
  var $listeners = _vm.$listeners
  var proxyConfig = _vm.proxyConfig
  var proxyOpts = _vm.proxyOpts
  var ons = {}

  _xeUtils['default'].each($listeners, function (cb, type) {
    ons[type] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key]
      }

      _vm.$emit.apply(_vm, [type].concat(args))
    }
  })

  ons['checkbox-all'] = _vm.checkboxAllEvent
  ons['checkbox-change'] = _vm.checkboxChangeEvent

  if (proxyConfig) {
    if (proxyOpts.sort) {
      ons['sort-change'] = _vm.sortChangeEvent
    }

    if (proxyOpts.filter) {
      ons['filter-change'] = _vm.filterChangeEvent
    }
  }

  return ons
}

function registerComponent (vxetable) {
  var setup = vxetable.setup
  var t = vxetable.t
  var GlobalConfig = setup({})
  var propKeys = Object.keys(_vxeTable.Table.props).filter(function (name) {
    return ['data', 'treeConfig'].indexOf(name) === -1
  })
  var options = {
    name: 'VxeVirtualTree',
    'extends': _vxeTable.Grid,
    data: function data () {
      return {
        removeList: [],
        treeLazyLoadeds: []
      }
    },
    computed: {
      treeOpts: function treeOpts () {
        return Object.assign({}, GlobalConfig.table.treeConfig, this.treeConfig)
      },
      checkboxOpts: function checkboxOpts () {
        return Object.assign({}, GlobalConfig.table.checkboxConfig, this.checkboxConfig)
      },
      tableExtendProps: function tableExtendProps () {
        var _this = this

        var rest = {}
        propKeys.forEach(function (key) {
          rest[key] = _this[key]
        })

        if (rest.checkboxConfig) {
          rest.checkboxConfig = this.checkboxOpts
        }

        return rest
      }
    },
    watch: {
      columns: function columns (value) {
        this.handleColumns(value)
      },
      data: function data (value) {
        this.loadData(value)
      }
    },
    created: function created () {
      var $vxe = this.$vxe
      var treeOpts = this.treeOpts
      var data = this.data
      var columns = this.columns
      Object.assign(this, {
        fullTreeData: [],
        treeTableData: [],
        fullTreeRowMap: new Map()
      })

      if (this.keepSource) {
        console.error($vxe.t('vxe.error.notProp', ['keep-source']))
      }

      if (treeOpts.line) {
        console.error($vxe.t('vxe.error.notProp', ['checkbox-config.line']))
      }

      if (columns) {
        this.handleColumns(columns)
      }

      if (data) {
        this.reloadData(data)
      }
    },
    render: function render (h) {
      var _ref

      var vSize = this.vSize
      var isZMax = this.isZMax
      var $scopedSlots = this.$scopedSlots
      var hasForm = !!($scopedSlots.form || this.formConfig)
      var hasToolbar = !!($scopedSlots.toolbar || this.toolbarConfig || this.toolbar)
      var hasPager = !!($scopedSlots.pager || this.pagerConfig)
      return h('div', {
        'class': ['vxe-grid', 'vxe-virtual-tree', (_ref = {}, _defineProperty(_ref, 'size--'.concat(vSize), vSize), _defineProperty(_ref, 't--animat', !!this.animat), _defineProperty(_ref, 'is--round', this.round), _defineProperty(_ref, 'is--maximize', isZMax), _defineProperty(_ref, 'is--loading', this.loading || this.tableLoading), _ref)],
        style: this.renderStyle
      }, [
      /**
       * 渲染表单
       */
        hasForm ? h('div', {
          ref: 'formWrapper',
          staticClass: 'vxe-grid--form-wrapper'
        }, $scopedSlots.form ? $scopedSlots.form.call(this, {
          $grid: this
        }, h) : renderDefaultForm(h, this)) : null,
        /**
       * 渲染工具栏
       */
        hasToolbar ? h('div', {
          ref: 'toolbarWrapper',
          'class': 'vxe-grid--toolbar-wrapper'
        }, $scopedSlots.toolbar ? $scopedSlots.toolbar.call(this, {
          $grid: this
        }, h) : [h('vxe-toolbar', {
          props: this.toolbarOpts,
          ref: 'xToolbar',
          scopedSlots: getToolbarSlots(this)
        })]) : null,
        /**
       * 渲染表格顶部区域
       */
        $scopedSlots.top ? h('div', {
          ref: 'topWrapper',
          staticClass: 'vxe-grid--top-wrapper'
        }, $scopedSlots.top.call(this, {
          $grid: this
        }, h)) : null,
        /**
       * 渲染表格
       */
        h('vxe-table', {
          props: this.tableProps,
          on: getTableOns(this),
          scopedSlots: $scopedSlots,
          ref: 'xTable'
        }),
        /**
       * 渲染表格底部区域
       */
        $scopedSlots.bottom ? h('div', {
          ref: 'bottomWrapper',
          staticClass: 'vxe-grid--bottom-wrapper'
        }, $scopedSlots.bottom.call(this, {
          $grid: this
        }, h)) : null,
        /**
       * 渲染分页
       */
        hasPager ? h('div', {
          ref: 'pagerWrapper',
          staticClass: 'vxe-grid--pager-wrapper'
        }, $scopedSlots.pager ? $scopedSlots.pager.call(this, {
          $grid: this
        }, h) : [h('vxe-pager', {
          props: this.pagerProps,
          on: {
            'page-change': this.pageChangeEvent
          },
          scopedSlots: getPagerSlots(this)
        })]) : null])
    },
    methods: {
      loadColumn: function loadColumn (columns) {
        var _this2 = this

        return this.$nextTick().then(function () {
          var $vxe = _this2.$vxe
          var $scopedSlots = _this2.$scopedSlots
          var renderTreeIcon = _this2.renderTreeIcon
          var treeOpts = _this2.treeOpts

          _xeUtils['default'].eachTree(columns, function (column) {
            if (column.treeNode) {
              if (!column.slots) {
                column.slots = {}
              }

              column.slots.icon = renderTreeIcon
            }

            if (column.slots) {
              _xeUtils['default'].each(column.slots, function (func, name, colSlots) {
                // 兼容 v2
                if (!_xeUtils['default'].isFunction(func)) {
                  if ($scopedSlots[func]) {
                    colSlots[name] = $scopedSlots[func]
                  } else {
                    colSlots[name] = null
                    console.error($vxe.t('vxe.error.notSlot', [func]))
                  }
                }
              })
            }
          }, treeOpts)

          _this2.$refs.xTable.loadColumn(columns)
        })
      },
      renderTreeIcon: function renderTreeIcon (params, h, cellVNodes) {
        var _this3 = this
        // console.log('cellVNodes', params, params.row.treeNode, cellVNodes, h)
        var treeLazyLoadeds = this.treeLazyLoadeds
        var treeOpts = this.treeOpts
        var isHidden = params.isHidden
        var row = params.row
        var children = treeOpts.children
        var hasChild = treeOpts.hasChild
        var indent = treeOpts.indent
        var lazy = treeOpts.lazy
        var trigger = treeOpts.trigger
        var iconLoaded = treeOpts.iconLoaded
        var showIcon = treeOpts.showIcon
        var iconOpen = treeOpts.iconOpen
        var iconClose = treeOpts.iconClose
        var rowChilds = row[children]
        var hasLazyChilds = false
        var isAceived = false
        var isLazyLoaded = false
        var on = {}
        // add
        if (params.row.treeNode === params.$columnIndex) {
          showIcon = true
        } else {
          showIcon = false
        }

        if (!isHidden) {
          isAceived = row._X_EXPAND

          if (lazy) {
            isLazyLoaded = treeLazyLoadeds.indexOf(row) > -1
            hasLazyChilds = row[hasChild]
          }
        }

        if (!trigger || trigger === 'default') {
          on.click = function (evnt) {
            return _this3.triggerTreeExpandEvent(evnt, params)
          }
        }
        // alert(JSON.stringify(showIcon))
        return [h('div', {
          'class': ['vxe-cell--tree-node', {
            'is--active': isAceived
          }],
          style: {
            paddingLeft: ''.concat(row._X_LEVEL * indent, 'px')
          }
        }, [showIcon && (rowChilds && rowChilds.length || hasLazyChilds) ? [h('div', {
          'class': 'vxe-tree--btn-wrapper',
          on: on
        }, [h('i', {
          'class': ['vxe-tree--node-btn', isLazyLoaded ? iconLoaded || GlobalConfig.icon.TABLE_TREE_LOADED : isAceived ? iconOpen || GlobalConfig.icon.TABLE_TREE_OPEN : iconClose || GlobalConfig.icon.TABLE_TREE_CLOSE]
        })])] : null, h('div', {
          'class': 'vxe-tree-cell'
        }, cellVNodes)])]
      },
      _loadTreeData: function _loadTreeData (data) {
        var _this4 = this

        var highlightCurrentRow = this.highlightCurrentRow
        var selectRow = this.getRadioRecord()
        var currentRow

        if (highlightCurrentRow) {
          currentRow = this.getCurrentRecord()
        }

        return this.$nextTick().then(function () {
          return _this4.$refs.xTable.loadData(data)
        }).then(function () {
          if (selectRow) {
            _this4.setRadioRow(selectRow)
          }

          if (highlightCurrentRow && currentRow) {
            _this4.setCurrentRow(currentRow)
          }
        })
      },
      getData: function getData (rowIndex) {
        var fullTreeData = this.fullTreeData
        return _xeUtils['default'].isUndefined(rowIndex) ? fullTreeData.slice(0) : fullTreeData[rowIndex]
      },
      loadData: function loadData (data) {
        return this._loadTreeData(this.toVirtualTree(data))
      },
      reloadData: function reloadData (data) {
        var _this5 = this

        return this.$nextTick().then(function () {
          return _this5.$refs.xTable.reloadData(_this5.toVirtualTree(data))
        }).then(function () {
          return _this5.handleDefaultTreeExpand()
        })
      },
      isTreeExpandByRow: function isTreeExpandByRow (row) {
        return !!row._X_EXPAND
      },
      setTreeExpansion: function setTreeExpansion (rows, expanded) {
        return this.setTreeExpand(rows, expanded)
      },
      handleAsyncTreeExpandChilds: function handleAsyncTreeExpandChilds (row) {
        var _this6 = this

        var treeLazyLoadeds = this.treeLazyLoadeds
        var treeOpts = this.treeOpts
        var checkboxOpts = this.checkboxOpts
        var loadMethod = treeOpts.loadMethod
        var children = treeOpts.children
        var checkStrictly = checkboxOpts.checkStrictly
        return new Promise(function (resolve) {
          if (loadMethod) {
            treeLazyLoadeds.push(row)
            loadMethod({
              row: row
            })['catch'](function () {
              return []
            }).then(function (childs) {
              row._X_LOADED = true

              _xeUtils['default'].remove(treeLazyLoadeds, function (item) {
                return item === row
              })

              if (!_xeUtils['default'].isArray(childs)) {
                childs = []
              }

              if (childs) {
                row[children] = childs.map(function (item) {
                  item._X_LOADED = false
                  item._X_EXPAND = false
                  item._X_INSERT = false
                  item._X_LEVEL = row._X_LEVEL + 1
                  return item
                })

                if (childs.length && !row._X_EXPAND) {
                  _this6.virtualExpand(row, true)
                } // 如果当前节点已选中，则展开后子节点也被选中

                if (!checkStrictly && _this6.isCheckedByCheckboxRow(row)) {
                  _this6.setCheckboxRow(childs, true)
                }
              }

              resolve(_this6.$nextTick().then(function () {
                return _this6.recalculate()
              }))
            })
          } else {
            resolve(null)
          }
        })
      },
      setTreeExpand: function setTreeExpand (rows, expanded) {
        var _this7 = this

        var treeLazyLoadeds = this.treeLazyLoadeds
        var treeOpts = this.treeOpts
        var tableFullData = this.tableFullData
        var treeNodeColumn = this.treeNodeColumn
        var lazy = treeOpts.lazy
        var hasChild = treeOpts.hasChild
        var accordion = treeOpts.accordion
        var toggleMethod = treeOpts.toggleMethod
        var result = []

        if (rows) {
          if (!_xeUtils['default'].isArray(rows)) {
            rows = [rows]
          }

          var columnIndex = this.getColumnIndex(treeNodeColumn)
          var $columnIndex = this.getVMColumnIndex(treeNodeColumn)
          var validRows = toggleMethod ? rows.filter(function (row) {
            return toggleMethod({
              expanded: expanded,
              column: treeNodeColumn,
              row: row,
              columnIndex: columnIndex,
              $columnIndex: $columnIndex
            })
          }) : rows

          if (accordion) {
            validRows = validRows.length ? [validRows[validRows.length - 1]] : [] // 同一级只能展开一个

            var matchObj = _xeUtils['default'].findTree(tableFullData, function (item) {
              return item === rows[0]
            }, treeOpts)

            if (matchObj) {
              matchObj.items.forEach(function (row) {
                row._X_EXPAND = false
              })
            }
          }

          validRows.forEach(function (row) {
            var isLoad = lazy && row[hasChild] && !row._X_LOADED && treeLazyLoadeds.indexOf(row) === -1 // 是否使用懒加载

            if (expanded && isLoad) {
              result.push(_this7.handleAsyncTreeExpandChilds(row))
            } else {
              if (hasChilds(_this7, row)) {
                _this7.virtualExpand(row, !!expanded)
              }
            }
          })
          return Promise.all(result).then(function () {
            _this7._loadTreeData(_this7.treeTableData)

            return _this7.recalculate()
          })
        }

        return this.$nextTick()
      },
      setAllTreeExpansion: function setAllTreeExpansion (expanded) {
        return this.setAllTreeExpand(expanded)
      },
      setAllTreeExpand: function setAllTreeExpand (expanded) {
        return this._loadTreeData(this.virtualAllExpand(expanded))
      },
      toggleTreeExpansion: function toggleTreeExpansion (row) {
        return this.toggleTreeExpand(row)
      },
      triggerTreeExpandEvent: function triggerTreeExpandEvent (evnt, params) {
        var treeOpts = this.treeOpts
        var treeLazyLoadeds = this.treeLazyLoadeds
        var row = params.row
        var column = params.column
        var lazy = treeOpts.lazy

        if (!lazy || treeLazyLoadeds.indexOf(row) === -1) {
          var expanded = !this.isTreeExpandByRow(row)
          this.setTreeExpand(row, expanded)
          this.$emit('toggle-tree-expand', {
            expanded: expanded,
            column: column,
            row: row,
            $event: evnt
          })
        }
      },
      toggleTreeExpand: function toggleTreeExpand (row) {
        return this._loadTreeData(this.virtualExpand(row, !row._X_EXPAND))
      },
      getTreeExpandRecords: function getTreeExpandRecords () {
        var _this8 = this

        var fullTreeData = this.fullTreeData
        var treeOpts = this.treeOpts
        var treeExpandRecords = []

        _xeUtils['default'].eachTree(fullTreeData, function (row) {
          if (row._X_EXPAND && hasChilds(_this8, row)) {
            treeExpandRecords.push(row)
          }
        }, treeOpts)

        return treeExpandRecords
      },
      clearTreeExpand: function clearTreeExpand () {
        return this.setAllTreeExpand(false)
      },
      handleColumns: function handleColumns (columns) {
        var $vxe = this.$vxe
        var renderTreeIcon = this.renderTreeIcon
        var checkboxOpts = this.checkboxOpts

        if (columns) {
          if ((!checkboxOpts.checkField || !checkboxOpts.halfField) && columns.some(function (conf) {
            return conf.type === 'checkbox'
          })) {
            console.error($vxe.t('vxe.error.reqProp', ['table.checkbox-config.checkField | table.checkbox-config.halfField']))
            return []
          }

          var treeNodeColumn = columns.find(function (conf) {
            return conf.treeNode
          })

          if (treeNodeColumn) {
            var slots = treeNodeColumn.slots || {}
            slots.icon = renderTreeIcon
            treeNodeColumn.slots = slots
            this.treeNodeColumn = treeNodeColumn
          }

          return columns
        }

        return []
      },

      /**
       * 获取表格数据集，包含新增、删除
       * 不支持修改
       */
      getRecordset: function getRecordset () {
        return {
          insertRecords: this.getInsertRecords(),
          removeRecords: this.getRemoveRecords(),
          updateRecords: []
        }
      },
      isInsertByRow: function isInsertByRow (row) {
        return !!row._X_INSERT
      },
      getInsertRecords: function getInsertRecords () {
        var treeOpts = this.treeOpts
        var insertRecords = []

        _xeUtils['default'].eachTree(this.fullTreeData, function (row) {
          if (row._X_INSERT) {
            insertRecords.push(row)
          }
        }, treeOpts)

        return insertRecords
      },
      insert: function insert (records) {
        return this.insertAt(records, null)
      },

      /**
       * 支持任意层级插入与删除
       */
      insertAt: function insertAt (records, row) {
        var _this9 = this

        var fullTreeData = this.fullTreeData
        var treeTableData = this.treeTableData
        var treeOpts = this.treeOpts

        if (!_xeUtils['default'].isArray(records)) {
          records = [records]
        }

        var newRecords = records.map(function (record) {
          return _this9.defineField(Object.assign({
            _X_LOADED: false,
            _X_EXPAND: false,
            _X_INSERT: true,
            _X_LEVEL: 0
          }, record))
        })

        if (!row) {
          fullTreeData.unshift.apply(fullTreeData, _toConsumableArray(newRecords))
          treeTableData.unshift.apply(treeTableData, _toConsumableArray(newRecords))
        } else {
          if (row === -1) {
            fullTreeData.push.apply(fullTreeData, _toConsumableArray(newRecords))
            treeTableData.push.apply(treeTableData, _toConsumableArray(newRecords))
          } else {
            var matchObj = _xeUtils['default'].findTree(fullTreeData, function (item) {
              return item === row
            }, treeOpts)

            if (!matchObj || matchObj.index === -1) {
              throw new Error(t('vxe.error.unableInsert'))
            }

            var items = matchObj.items
            var index = matchObj.index
            var nodes = matchObj.nodes
            var rowIndex = treeTableData.indexOf(row)

            if (rowIndex > -1) {
              treeTableData.splice.apply(treeTableData, [rowIndex, 0].concat(_toConsumableArray(newRecords)))
            }

            items.splice.apply(items, [index, 0].concat(_toConsumableArray(newRecords)))
            newRecords.forEach(function (item) {
              item._X_LEVEL = nodes.length - 1
            })
          }
        }

        return this._loadTreeData(treeTableData).then(function () {
          return {
            row: newRecords.length ? newRecords[newRecords.length - 1] : null,
            rows: newRecords
          }
        })
      },

      /**
       * 获取已删除的数据
       */
      getRemoveRecords: function getRemoveRecords () {
        return this.removeList
      },
      removeSelecteds: function removeSelecteds () {
        return this.removeCheckboxRow()
      },

      /**
       * 删除选中数据
       */
      removeCheckboxRow: function removeCheckboxRow () {
        var _this10 = this

        return this.remove(this.getCheckboxRecords()).then(function (params) {
          _this10.clearSelection()

          return params
        })
      },
      remove: function remove (rows) {
        var _this11 = this

        var removeList = this.removeList
        var fullTreeData = this.fullTreeData
        var treeOpts = this.treeOpts
        var rest = []

        if (!rows) {
          rows = fullTreeData
        } else if (!_xeUtils['default'].isArray(rows)) {
          rows = [rows]
        }

        rows.forEach(function (row) {
          var matchObj = _xeUtils['default'].findTree(fullTreeData, function (item) {
            return item === row
          }, treeOpts)

          if (matchObj) {
            var item = matchObj.item
            var items = matchObj.items
            var index = matchObj.index
            var parent = matchObj.parent

            if (!_this11.isInsertByRow(row)) {
              removeList.push(row)
            }

            if (parent) {
              var isExpand = _this11.isTreeExpandByRow(parent)

              if (isExpand) {
                _this11.handleCollapsing(parent)
              }

              items.splice(index, 1)

              if (isExpand) {
                _this11.handleExpanding(parent)
              }
            } else {
              _this11.handleCollapsing(item)

              items.splice(index, 1)

              _this11.treeTableData.splice(_this11.treeTableData.indexOf(item), 1)
            }

            rest.push(item)
          }
        })
        return this._loadTreeData(this.treeTableData).then(function () {
          return {
            row: rest.length ? rest[rest.length - 1] : null,
            rows: rest
          }
        })
      },

      /**
       * 处理默认展开树节点
       */
      handleDefaultTreeExpand: function handleDefaultTreeExpand () {
        var _this12 = this

        var treeConfig = this.treeConfig
        var treeOpts = this.treeOpts
        var tableFullData = this.tableFullData

        if (treeConfig) {
          var children = treeOpts.children
          var expandAll = treeOpts.expandAll
          var expandRowKeys = treeOpts.expandRowKeys

          if (expandAll) {
            this.setAllTreeExpand(true)
          } else if (expandRowKeys && this.rowId) {
            var rowkey = this.rowId
            expandRowKeys.forEach(function (rowid) {
              var matchObj = _xeUtils['default'].findTree(tableFullData, function (item) {
                return rowid === _xeUtils['default'].get(item, rowkey)
              }, treeOpts)

              var rowChildren = matchObj ? matchObj.item[children] : 0

              if (rowChildren && rowChildren.length) {
                _this12.setTreeExpand(matchObj.item, true)
              }
            })
          }
        }
      },

      /**
       * 定义树属性
       */
      toVirtualTree: function toVirtualTree (treeData) {
        var treeOpts = this.treeOpts
        var fullTreeRowMap = this.fullTreeRowMap
        fullTreeRowMap.clear()

        _xeUtils['default'].eachTree(treeData, function (item, index, items, paths, parent, nodes) {
          item._X_LOADED = false
          item._X_EXPAND = false
          item._X_INSERT = false
          item._X_LEVEL = nodes.length - 1
          fullTreeRowMap.set(item, {
            item: item,
            index: index,
            items: items,
            paths: paths,
            parent: parent,
            nodes: nodes
          })
        }, treeOpts)

        this.fullTreeData = treeData.slice(0)
        this.treeTableData = treeData.slice(0)
        return treeData
      },

      /**
       * 展开/收起树节点
       */
      virtualExpand: function virtualExpand (row, expanded) {
        var treeOpts = this.treeOpts
        var treeNodeColumn = this.treeNodeColumn
        var toggleMethod = treeOpts.toggleMethod
        var columnIndex = this.getColumnIndex(treeNodeColumn)
        var $columnIndex = this.getVMColumnIndex(treeNodeColumn)

        if (!toggleMethod || toggleMethod({
          expanded: expanded,
          row: row,
          column: treeNodeColumn,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex
        })) {
          if (row._X_EXPAND !== expanded) {
            if (row._X_EXPAND) {
              this.handleCollapsing(row)
            } else {
              this.handleExpanding(row)
            }
          }
        }

        return this.treeTableData
      },
      // 展开节点
      handleExpanding: function handleExpanding (row) {
        if (hasChilds(this, row)) {
          var treeTableData = this.treeTableData
          var treeOpts = this.treeOpts
          var childRows = row[treeOpts.children]
          var expandList = []
          var rowIndex = treeTableData.indexOf(row)

          if (rowIndex === -1) {
            throw new Error('Expanding error')
          }

          var expandMaps = new Map()

          _xeUtils['default'].eachTree(childRows, function (item, index, obj, paths, parent, nodes) {
            if (!parent || parent._X_EXPAND && expandMaps.has(parent)) {
              expandMaps.set(item, 1)
              expandList.push(item)
            }
          }, treeOpts)

          row._X_EXPAND = true
          treeTableData.splice.apply(treeTableData, [rowIndex + 1, 0].concat(expandList))
        }

        return this.treeTableData
      },
      // 收起节点
      handleCollapsing: function handleCollapsing (row) {
        if (hasChilds(this, row)) {
          var treeTableData = this.treeTableData
          var treeOpts = this.treeOpts
          var childRows = row[treeOpts.children]
          var nodeChildList = []

          _xeUtils['default'].eachTree(childRows, function (item) {
            nodeChildList.push(item)
          }, treeOpts)

          row._X_EXPAND = false
          this.treeTableData = treeTableData.filter(function (item) {
            return nodeChildList.indexOf(item) === -1
          })
        }

        return this.treeTableData
      },

      /**
       * 展开/收起所有树节点
       */
      virtualAllExpand: function virtualAllExpand (expanded) {
        var treeOpts = this.treeOpts

        if (expanded) {
          var tableList = []

          _xeUtils['default'].eachTree(this.fullTreeData, function (row) {
            row._X_EXPAND = expanded
            tableList.push(row)
          }, treeOpts)

          this.treeTableData = tableList
        } else {
          _xeUtils['default'].eachTree(this.fullTreeData, function (row) {
            row._X_EXPAND = expanded
          }, treeOpts)

          this.treeTableData = this.fullTreeData.slice(0)
        }

        return this.treeTableData
      },
      clearCheckboxRow: function clearCheckboxRow () {
        return this.setAllCheckboxRow(false)
      },
      toggleAllCheckboxRow: function toggleAllCheckboxRow () {
        var checkboxOpts = this.checkboxOpts
        var checkField = checkboxOpts.checkField
        var checkStrictly = checkboxOpts.checkStrictly

        if (checkField && !checkStrictly) {
          return this.setAllCheckboxRow(!this.fullTreeData.every(function (row) {
            return row[checkField]
          }))
        }

        return this.$nextTick()
      },
      setAllCheckboxRow: function setAllCheckboxRow (checked) {
        var checkboxOpts = this.checkboxOpts
        var treeOpts = this.treeOpts
        var checkField = checkboxOpts.checkField
        var halfField = checkboxOpts.halfField
        var checkStrictly = checkboxOpts.checkStrictly

        if (checkField && !checkStrictly) {
          _xeUtils['default'].eachTree(this.fullTreeData, function (row) {
            row[checkField] = checked

            if (halfField) {
              row[halfField] = false
            }
          }, treeOpts)

          this.$refs.xTable.checkSelectionStatus()
        }

        return this.$nextTick()
      },
      checkboxAllEvent: function checkboxAllEvent (params) {
        var checked = params.checked
        this.setAllCheckboxRow(checked)
        this.$emit('checkbox-all', params)
      },
      checkboxChangeEvent: function checkboxChangeEvent (params) {
        var row = params.row
        var checked = params.checked
        this.setCheckboxRow(row, checked)
        this.$emit('checkbox-change', params)
      },
      toggleCheckboxRow: function toggleCheckboxRow (rows) {
        var _this13 = this

        var checkboxOpts = this.checkboxOpts
        var checkField = checkboxOpts.checkField

        if (checkField) {
          rows.forEach(function (row) {
            _this13.setCheckboxRow(row, !row[checkField])
          })
        }
      },
      setCheckboxRow: function setCheckboxRow (rows, checked) {
        var _this14 = this

        var checkboxOpts = this.checkboxOpts
        var treeOpts = this.treeOpts
        var checkField = checkboxOpts.checkField
        var halfField = checkboxOpts.halfField
        var checkStrictly = checkboxOpts.checkStrictly

        if (!_xeUtils['default'].isArray(rows)) {
          rows = [rows]
        }

        if (checkField) {
          if (checkStrictly) {
            rows.forEach(function (row) {
              row[checkField] = checked

              if (halfField) {
                row[halfField] = false
              }
            })
          } else {
            _xeUtils['default'].eachTree(rows, function (row) {
              row[checkField] = checked

              if (halfField) {
                row[halfField] = false
              }
            }, treeOpts)

            rows.forEach(function (row) {
              _this14.checkParentNodeSelection(row)
            })
          }
        }

        return this.$nextTick()
      },
      checkParentNodeSelection: function checkParentNodeSelection (row) {
        var checkboxOpts = this.checkboxOpts
        var treeOpts = this.treeOpts
        var children = treeOpts.children
        var checkField = checkboxOpts.checkField
        var halfField = checkboxOpts.halfField
        var checkStrictly = checkboxOpts.checkStrictly

        var matchObj = _xeUtils['default'].findTree(this.fullTreeData, function (item) {
          return item === row
        }, treeOpts)

        if (matchObj && checkField && !checkStrictly) {
          var parentRow = matchObj.parent

          if (parentRow) {
            var isAll = parentRow[children].every(function (item) {
              return item[checkField]
            })

            if (halfField && !isAll) {
              parentRow[halfField] = parentRow[children].some(function (item) {
                return item[checkField] || item[halfField]
              })
            }

            parentRow[checkField] = isAll
            this.checkParentNodeSelection(parentRow)
          } else {
            this.$refs.xTable.checkSelectionStatus()
          }
        }
      },
      getCheckboxRecords: function getCheckboxRecords () {
        var checkboxOpts = this.checkboxOpts
        var treeOpts = this.treeOpts
        var checkField = checkboxOpts.checkField

        if (checkField) {
          var records = []

          _xeUtils['default'].eachTree(this.fullTreeData, function (row) {
            if (row[checkField]) {
              records.push(row)
            }
          }, treeOpts)

          return records
        }

        return this.$refs.xTable.getCheckboxRecords()
      },
      getCheckboxIndeterminateRecords: function getCheckboxIndeterminateRecords () {
        var checkboxOpts = this.checkboxOpts
        var treeOpts = this.treeOpts
        var halfField = checkboxOpts.halfField

        if (halfField) {
          var records = []

          _xeUtils['default'].eachTree(this.fullTreeData, function (row) {
            if (row[halfField]) {
              records.push(row)
            }
          }, treeOpts)

          return records
        }

        return this.$refs.xTable.getCheckboxIndeterminateRecords()
      }
    }
  }
  vxetable.Vue.component(options.name, options)
}
/**
 * 基于 vxe-table 表格的增强插件，实现简单的虚拟树表格
 */

var VXETablePluginVirtualTree = {
  install: function install (vxetable) {
    registerComponent(vxetable)
  }
}
exports.VXETablePluginVirtualTree = VXETablePluginVirtualTree

if (typeof window !== 'undefined' && window.VXETable && window.VXETable.use) {
  window.VXETable.use(VXETablePluginVirtualTree)
}

var _default = VXETablePluginVirtualTree
exports['default'] = _default
// # sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIiwiaW5kZXguanMiXSwibmFtZXMiOlsiaGFzQ2hpbGRzIiwiX3ZtIiwicm93IiwiY2hpbGRMaXN0IiwidHJlZU9wdHMiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbmRlckRlZmF1bHRGb3JtIiwiaCIsInByb3h5Q29uZmlnIiwicHJveHlPcHRzIiwiZm9ybURhdGEiLCJmb3JtQ29uZmlnIiwiZm9ybU9wdHMiLCJpdGVtcyIsImluaXRlZCIsImJlZm9yZUl0ZW0iLCJmb3JFYWNoIiwiaXRlbSIsImNhbGwiLCIkZ3JpZCIsInByb3BzIiwiT2JqZWN0IiwiYXNzaWduIiwiZGF0YSIsImZvcm0iLCJvbiIsInN1Ym1pdCIsInN1Ym1pdEV2ZW50IiwicmVzZXQiLCJyZXNldEV2ZW50Iiwic3VibWl0SW52YWxpZEV2ZW50IiwidG9nZ2xDb2xsYXBzZUV2ZW50IiwicmVmIiwiZ2V0VG9vbGJhclNsb3RzIiwiJHNjb3BlZFNsb3RzIiwidG9vbGJhck9wdHMiLCJ0b29sYmFyT3B0U2xvdHMiLCJzbG90cyIsIiRidXR0b25zIiwiJHRvb2xzIiwiYnV0dG9ucyIsInRvb2xzIiwiZ2V0UGFnZXJTbG90cyIsInBhZ2VyT3B0cyIsInBhZ2VyT3B0U2xvdHMiLCIkbGVmdCIsIiRyaWdodCIsImxlZnQiLCJyaWdodCIsImdldFRhYmxlT25zIiwiJGxpc3RlbmVycyIsIm9ucyIsIlhFVXRpbHMiLCJlYWNoIiwiY2IiLCJ0eXBlIiwiYXJncyIsIiRlbWl0IiwiY2hlY2tib3hBbGxFdmVudCIsImNoZWNrYm94Q2hhbmdlRXZlbnQiLCJzb3J0Iiwic29ydENoYW5nZUV2ZW50IiwiZmlsdGVyIiwiZmlsdGVyQ2hhbmdlRXZlbnQiLCJyZWdpc3RlckNvbXBvbmVudCIsInZ4ZXRhYmxlIiwic2V0dXAiLCJ0IiwiR2xvYmFsQ29uZmlnIiwicHJvcEtleXMiLCJrZXlzIiwiVGFibGUiLCJuYW1lIiwiaW5kZXhPZiIsIm9wdGlvbnMiLCJHcmlkIiwicmVtb3ZlTGlzdCIsInRyZWVMYXp5TG9hZGVkcyIsImNvbXB1dGVkIiwidGFibGUiLCJ0cmVlQ29uZmlnIiwiY2hlY2tib3hPcHRzIiwiY2hlY2tib3hDb25maWciLCJ0YWJsZUV4dGVuZFByb3BzIiwicmVzdCIsImtleSIsIndhdGNoIiwiY29sdW1ucyIsInZhbHVlIiwiaGFuZGxlQ29sdW1ucyIsImxvYWREYXRhIiwiY3JlYXRlZCIsIiR2eGUiLCJmdWxsVHJlZURhdGEiLCJ0cmVlVGFibGVEYXRhIiwiZnVsbFRyZWVSb3dNYXAiLCJNYXAiLCJrZWVwU291cmNlIiwiY29uc29sZSIsImVycm9yIiwibGluZSIsInJlbG9hZERhdGEiLCJyZW5kZXIiLCJ2U2l6ZSIsImlzWk1heCIsImhhc0Zvcm0iLCJoYXNUb29sYmFyIiwidG9vbGJhciIsInRvb2xiYXJDb25maWciLCJoYXNQYWdlciIsInBhZ2VyIiwicGFnZXJDb25maWciLCJhbmltYXQiLCJyb3VuZCIsImxvYWRpbmciLCJ0YWJsZUxvYWRpbmciLCJzdHlsZSIsInJlbmRlclN0eWxlIiwic3RhdGljQ2xhc3MiLCJzY29wZWRTbG90cyIsInRvcCIsInRhYmxlUHJvcHMiLCJib3R0b20iLCJwYWdlclByb3BzIiwicGFnZUNoYW5nZUV2ZW50IiwibWV0aG9kcyIsImxvYWRDb2x1bW4iLCIkbmV4dFRpY2siLCJ0aGVuIiwicmVuZGVyVHJlZUljb24iLCJlYWNoVHJlZSIsImNvbHVtbiIsInRyZWVOb2RlIiwiaWNvbiIsImZ1bmMiLCJjb2xTbG90cyIsImlzRnVuY3Rpb24iLCIkcmVmcyIsInhUYWJsZSIsInBhcmFtcyIsImNlbGxWTm9kZXMiLCJpc0hpZGRlbiIsImhhc0NoaWxkIiwiaW5kZW50IiwibGF6eSIsInRyaWdnZXIiLCJpY29uTG9hZGVkIiwic2hvd0ljb24iLCJpY29uT3BlbiIsImljb25DbG9zZSIsInJvd0NoaWxkcyIsImhhc0xhenlDaGlsZHMiLCJpc0FjZWl2ZWQiLCJpc0xhenlMb2FkZWQiLCJfWF9FWFBBTkQiLCJjbGljayIsImV2bnQiLCJ0cmlnZ2VyVHJlZUV4cGFuZEV2ZW50IiwicGFkZGluZ0xlZnQiLCJfWF9MRVZFTCIsIlRBQkxFX1RSRUVfTE9BREVEIiwiVEFCTEVfVFJFRV9PUEVOIiwiVEFCTEVfVFJFRV9DTE9TRSIsIl9sb2FkVHJlZURhdGEiLCJoaWdobGlnaHRDdXJyZW50Um93Iiwic2VsZWN0Um93IiwiZ2V0UmFkaW9SZWNvcmQiLCJjdXJyZW50Um93IiwiZ2V0Q3VycmVudFJlY29yZCIsInNldFJhZGlvUm93Iiwic2V0Q3VycmVudFJvdyIsImdldERhdGEiLCJyb3dJbmRleCIsImlzVW5kZWZpbmVkIiwic2xpY2UiLCJ0b1ZpcnR1YWxUcmVlIiwiaGFuZGxlRGVmYXVsdFRyZWVFeHBhbmQiLCJpc1RyZWVFeHBhbmRCeVJvdyIsInNldFRyZWVFeHBhbnNpb24iLCJyb3dzIiwiZXhwYW5kZWQiLCJzZXRUcmVlRXhwYW5kIiwiaGFuZGxlQXN5bmNUcmVlRXhwYW5kQ2hpbGRzIiwibG9hZE1ldGhvZCIsImNoZWNrU3RyaWN0bHkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInB1c2giLCJjaGlsZHMiLCJfWF9MT0FERUQiLCJyZW1vdmUiLCJpc0FycmF5IiwibWFwIiwiX1hfSU5TRVJUIiwidmlydHVhbEV4cGFuZCIsImlzQ2hlY2tlZEJ5Q2hlY2tib3hSb3ciLCJzZXRDaGVja2JveFJvdyIsInJlY2FsY3VsYXRlIiwidGFibGVGdWxsRGF0YSIsInRyZWVOb2RlQ29sdW1uIiwiYWNjb3JkaW9uIiwidG9nZ2xlTWV0aG9kIiwicmVzdWx0IiwiY29sdW1uSW5kZXgiLCJnZXRDb2x1bW5JbmRleCIsIiRjb2x1bW5JbmRleCIsImdldFZNQ29sdW1uSW5kZXgiLCJ2YWxpZFJvd3MiLCJtYXRjaE9iaiIsImZpbmRUcmVlIiwiaXNMb2FkIiwiYWxsIiwic2V0QWxsVHJlZUV4cGFuc2lvbiIsInNldEFsbFRyZWVFeHBhbmQiLCJ2aXJ0dWFsQWxsRXhwYW5kIiwidG9nZ2xlVHJlZUV4cGFuc2lvbiIsInRvZ2dsZVRyZWVFeHBhbmQiLCIkZXZlbnQiLCJnZXRUcmVlRXhwYW5kUmVjb3JkcyIsInRyZWVFeHBhbmRSZWNvcmRzIiwiY2xlYXJUcmVlRXhwYW5kIiwiY2hlY2tGaWVsZCIsImhhbGZGaWVsZCIsInNvbWUiLCJjb25mIiwiZmluZCIsImdldFJlY29yZHNldCIsImluc2VydFJlY29yZHMiLCJnZXRJbnNlcnRSZWNvcmRzIiwicmVtb3ZlUmVjb3JkcyIsImdldFJlbW92ZVJlY29yZHMiLCJ1cGRhdGVSZWNvcmRzIiwiaXNJbnNlcnRCeVJvdyIsImluc2VydCIsInJlY29yZHMiLCJpbnNlcnRBdCIsIm5ld1JlY29yZHMiLCJyZWNvcmQiLCJkZWZpbmVGaWVsZCIsInVuc2hpZnQiLCJpbmRleCIsIkVycm9yIiwibm9kZXMiLCJzcGxpY2UiLCJyZW1vdmVTZWxlY3RlZHMiLCJyZW1vdmVDaGVja2JveFJvdyIsImdldENoZWNrYm94UmVjb3JkcyIsImNsZWFyU2VsZWN0aW9uIiwicGFyZW50IiwiaXNFeHBhbmQiLCJoYW5kbGVDb2xsYXBzaW5nIiwiaGFuZGxlRXhwYW5kaW5nIiwiZXhwYW5kQWxsIiwiZXhwYW5kUm93S2V5cyIsInJvd0lkIiwicm93a2V5Iiwicm93aWQiLCJnZXQiLCJyb3dDaGlsZHJlbiIsInRyZWVEYXRhIiwiY2xlYXIiLCJwYXRocyIsInNldCIsImNoaWxkUm93cyIsImV4cGFuZExpc3QiLCJleHBhbmRNYXBzIiwib2JqIiwiaGFzIiwibm9kZUNoaWxkTGlzdCIsInRhYmxlTGlzdCIsImNsZWFyQ2hlY2tib3hSb3ciLCJzZXRBbGxDaGVja2JveFJvdyIsInRvZ2dsZUFsbENoZWNrYm94Um93IiwiZXZlcnkiLCJjaGVja2VkIiwiY2hlY2tTZWxlY3Rpb25TdGF0dXMiLCJ0b2dnbGVDaGVja2JveFJvdyIsImNoZWNrUGFyZW50Tm9kZVNlbGVjdGlvbiIsInBhcmVudFJvdyIsImlzQWxsIiwiZ2V0Q2hlY2tib3hJbmRldGVybWluYXRlUmVjb3JkcyIsIlZ1ZSIsImNvbXBvbmVudCIsIlZYRVRhYmxlUGx1Z2luVmlydHVhbFRyZWUiLCJpbnN0YWxs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SUEsU0FBSixFQUFlO0FBQ2IsY0FBTVksT0FBTyxHQUFVLEVBQXZCOztBQUNBdEwsOEJBQVE4RSxRQUFSLENBQWlCLEtBQUtyQyxZQUF0QixFQUFvQyxVQUFBNUYsR0FBRyxFQUFHO0FBQ3hDLGdCQUFJQSxHQUFHLENBQUM2TixTQUFELENBQVAsRUFBb0I7QUFDbEJZLGNBQUFBLE9BQU8sQ0FBQy9DLElBQVIsQ0FBYTFMLEdBQWI7QUFDRDtBQUNGLFdBSkQsRUFJR0UsUUFKSDs7QUFLQSxpQkFBT3VPLE9BQVA7QUFDRDs7QUFDRCxlQUFPLEtBQUtqRyxLQUFMLENBQVdDLE1BQVgsQ0FBa0I4SSwrQkFBbEIsRUFBUDtBQUNEO0FBbmxCTTtBQXRKeUIsR0FBcEM7QUE2dUJBdk4sRUFBQUEsUUFBUSxDQUFDd04sR0FBVCxDQUFhQyxTQUFiLENBQXVCaE4sT0FBTyxDQUFDRixJQUEvQixFQUFxQ0UsT0FBckM7QUFDRDtBQUVEO0FDdENBO0FBQ0E7OztBRHdDTyxJQUFNaU4seUJBQXlCLEdBQUc7QUFDdkNDLEVBQUFBLE9BRHVDLG1CQUM5QjNOLFFBRDhCLEVBQ0w7QUFDaENELElBQUFBLGlCQUFpQixDQUFDQyxRQUFELENBQWpCO0FBQ0Q7QUFIc0MsQ0FBbEM7OztBQU1QLElBQUksT0FBTzROLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBeEMsSUFBb0RELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBeEUsRUFBNkU7QUFDM0VGLEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JKLHlCQUFwQjtBQUNEOztlQUVjQSx5QiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlLCB7IENyZWF0ZUVsZW1lbnQsIFZOb2RlQ2hpbGRyZW4sIFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscydcclxuaW1wb3J0IHtcclxuICBWWEVUYWJsZSxcclxuICBUYWJsZSxcclxuICBHcmlkLFxyXG4gIENvbHVtbk9wdGlvbnMsXHJcbiAgQ29sdW1uQ2VsbFJlbmRlclBhcmFtc1xyXG59IGZyb20gJ3Z4ZS10YWJsZSdcclxuXHJcbmludGVyZmFjZSBWaXJ0dWFsVHJlZSBleHRlbmRzIEdyaWQge1xyXG4gICRyZWZzOiB7XHJcbiAgICB4VGFibGU6IFRhYmxlO1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gIH07XHJcbiAgX2xvYWRUcmVlRGF0YShkYXRhOiBhbnlbXSk6IFByb21pc2U8YW55PjtcclxuICBoYW5kbGVDb2x1bW5zKGNvbHVtbnM6IENvbHVtbk9wdGlvbnNbXSk6IENvbHVtbk9wdGlvbnNbXTtcclxuICB0b1ZpcnR1YWxUcmVlKHRyZWVEYXRhOiBhbnlbXSk6IGFueVtdO1xyXG4gIGhhbmRsZUV4cGFuZGluZyhyb3c6IGFueSk6IGFueVtdO1xyXG4gIGhhbmRsZUNvbGxhcHNpbmcocm93OiBhbnkpOiBhbnlbXTtcclxuICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhc0NoaWxkcyAoX3ZtOiBWaXJ0dWFsVHJlZSwgcm93OiBhbnkpIHtcclxuICBjb25zdCBjaGlsZExpc3QgPSByb3dbX3ZtLnRyZWVPcHRzLmNoaWxkcmVuXVxyXG4gIHJldHVybiBjaGlsZExpc3QgJiYgY2hpbGRMaXN0Lmxlbmd0aFxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJEZWZhdWx0Rm9ybSAoaDogQ3JlYXRlRWxlbWVudCwgX3ZtOiBWaXJ0dWFsVHJlZSkge1xyXG4gIGNvbnN0IHsgcHJveHlDb25maWcsIHByb3h5T3B0cywgZm9ybURhdGEsIGZvcm1Db25maWcsIGZvcm1PcHRzIH0gPSBfdm1cclxuICBpZiAoZm9ybUNvbmZpZyAmJiBmb3JtT3B0cy5pdGVtcyAmJiBmb3JtT3B0cy5pdGVtcy5sZW5ndGgpIHtcclxuICAgIGlmICghZm9ybU9wdHMuaW5pdGVkKSB7XHJcbiAgICAgIGZvcm1PcHRzLmluaXRlZCA9IHRydWVcclxuICAgICAgY29uc3QgYmVmb3JlSXRlbSA9IHByb3h5T3B0cy5iZWZvcmVJdGVtXHJcbiAgICAgIGlmIChwcm94eU9wdHMgJiYgYmVmb3JlSXRlbSkge1xyXG4gICAgICAgIGZvcm1PcHRzLml0ZW1zLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgYmVmb3JlSXRlbS5jYWxsKF92bSwgeyAkZ3JpZDogX3ZtLCBpdGVtIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaCgndnhlLWZvcm0nLCB7XHJcbiAgICAgICAgcHJvcHM6IE9iamVjdC5hc3NpZ24oe30sIGZvcm1PcHRzLCB7XHJcbiAgICAgICAgICBkYXRhOiBwcm94eUNvbmZpZyAmJiBwcm94eU9wdHMuZm9ybSA/IGZvcm1EYXRhIDogZm9ybU9wdHMuZGF0YVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBzdWJtaXQ6IF92bS5zdWJtaXRFdmVudCxcclxuICAgICAgICAgIHJlc2V0OiBfdm0ucmVzZXRFdmVudCxcclxuICAgICAgICAgICdzdWJtaXQtaW52YWxpZCc6IF92bS5zdWJtaXRJbnZhbGlkRXZlbnQsXHJcbiAgICAgICAgICAndG9nZ2xlLWNvbGxhcHNlJzogX3ZtLnRvZ2dsQ29sbGFwc2VFdmVudFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAnZm9ybSdcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbiAgcmV0dXJuIFtdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRvb2xiYXJTbG90cyAoX3ZtOiBWaXJ0dWFsVHJlZSkge1xyXG4gIGNvbnN0IHsgJHNjb3BlZFNsb3RzLCB0b29sYmFyT3B0cyB9ID0gX3ZtXHJcbiAgY29uc3QgdG9vbGJhck9wdFNsb3RzID0gdG9vbGJhck9wdHMuc2xvdHNcclxuICBsZXQgJGJ1dHRvbnNcclxuICBsZXQgJHRvb2xzXHJcbiAgY29uc3Qgc2xvdHM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fVxyXG4gIGlmICh0b29sYmFyT3B0U2xvdHMpIHtcclxuICAgICRidXR0b25zID0gdG9vbGJhck9wdFNsb3RzLmJ1dHRvbnNcclxuICAgICR0b29scyA9IHRvb2xiYXJPcHRTbG90cy50b29sc1xyXG4gICAgaWYgKCRidXR0b25zICYmICRzY29wZWRTbG90c1skYnV0dG9uc10pIHtcclxuICAgICAgJGJ1dHRvbnMgPSAkc2NvcGVkU2xvdHNbJGJ1dHRvbnNdXHJcbiAgICB9XHJcbiAgICBpZiAoJHRvb2xzICYmICRzY29wZWRTbG90c1skdG9vbHNdKSB7XHJcbiAgICAgICR0b29scyA9ICRzY29wZWRTbG90c1skdG9vbHNdXHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICgkYnV0dG9ucykge1xyXG4gICAgc2xvdHMuYnV0dG9ucyA9ICRidXR0b25zXHJcbiAgfVxyXG4gIGlmICgkdG9vbHMpIHtcclxuICAgIHNsb3RzLnRvb2xzID0gJHRvb2xzXHJcbiAgfVxyXG4gIHJldHVybiBzbG90c1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYWdlclNsb3RzIChfdm06IFZpcnR1YWxUcmVlKSB7XHJcbiAgY29uc3QgeyAkc2NvcGVkU2xvdHMsIHBhZ2VyT3B0cyB9ID0gX3ZtXHJcbiAgY29uc3QgcGFnZXJPcHRTbG90cyA9IHBhZ2VyT3B0cy5zbG90c1xyXG4gIGNvbnN0IHNsb3RzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge31cclxuICBsZXQgJGxlZnRcclxuICBsZXQgJHJpZ2h0XHJcbiAgaWYgKHBhZ2VyT3B0U2xvdHMpIHtcclxuICAgICRsZWZ0ID0gcGFnZXJPcHRTbG90cy5sZWZ0XHJcbiAgICAkcmlnaHQgPSBwYWdlck9wdFNsb3RzLnJpZ2h0XHJcbiAgICBpZiAoJGxlZnQgJiYgJHNjb3BlZFNsb3RzWyRsZWZ0XSkge1xyXG4gICAgICAkbGVmdCA9ICRzY29wZWRTbG90c1skbGVmdF1cclxuICAgIH1cclxuICAgIGlmICgkcmlnaHQgJiYgJHNjb3BlZFNsb3RzWyRyaWdodF0pIHtcclxuICAgICAgJHJpZ2h0ID0gJHNjb3BlZFNsb3RzWyRyaWdodF1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCRsZWZ0KSB7XHJcbiAgICBzbG90cy5sZWZ0ID0gJGxlZnRcclxuICB9XHJcbiAgaWYgKCRyaWdodCkge1xyXG4gICAgc2xvdHMucmlnaHQgPSAkcmlnaHRcclxuICB9XHJcbiAgcmV0dXJuIHNsb3RzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRhYmxlT25zIChfdm06IFZpcnR1YWxUcmVlKSB7XHJcbiAgY29uc3QgeyAkbGlzdGVuZXJzLCBwcm94eUNvbmZpZywgcHJveHlPcHRzIH0gPSBfdm1cclxuICBjb25zdCBvbnM6IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9XHJcbiAgWEVVdGlscy5lYWNoKCRsaXN0ZW5lcnMsIChjYiwgdHlwZSkgPT4ge1xyXG4gICAgb25zW3R5cGVdID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgIF92bS4kZW1pdCh0eXBlLCAuLi5hcmdzKVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgb25zWydjaGVja2JveC1hbGwnXSA9IF92bS5jaGVja2JveEFsbEV2ZW50XHJcbiAgb25zWydjaGVja2JveC1jaGFuZ2UnXSA9IF92bS5jaGVja2JveENoYW5nZUV2ZW50XHJcbiAgaWYgKHByb3h5Q29uZmlnKSB7XHJcbiAgICBpZiAocHJveHlPcHRzLnNvcnQpIHtcclxuICAgICAgb25zWydzb3J0LWNoYW5nZSddID0gX3ZtLnNvcnRDaGFuZ2VFdmVudFxyXG4gICAgfVxyXG4gICAgaWYgKHByb3h5T3B0cy5maWx0ZXIpIHtcclxuICAgICAgb25zWydmaWx0ZXItY2hhbmdlJ10gPSBfdm0uZmlsdGVyQ2hhbmdlRXZlbnRcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG9uc1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAndnhlLXRhYmxlJyB7XHJcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuICBpbnRlcmZhY2UgVlhFVGFibGVDb3JlIHtcclxuICAgIFZ1ZTogdHlwZW9mIFZ1ZTtcclxuICAgIEdyaWQ6IEdyaWQ7XHJcbiAgICBUYWJsZTogVGFibGU7XHJcbiAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgVmlydHVhbFRyZWVPcHRpb25zIHtcclxuICBkYXRhPzogKHRoaXM6IFZpcnR1YWxUcmVlKSA9PiBhbnk7XHJcbiAgY29tcHV0ZWQ/OiB7IFtrZXk6IHN0cmluZ106ICh0aGlzOiBWaXJ0dWFsVHJlZSkgPT4gYW55IH1cclxuICB3YXRjaD86IHsgW2tleTogc3RyaW5nXTogKHRoaXM6IFZpcnR1YWxUcmVlLCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55IH1cclxuICBjcmVhdGVkPzogKHRoaXM6IFZpcnR1YWxUcmVlKSA9PiBhbnk7XHJcbiAgcmVuZGVyPzogKHRoaXM6IFZpcnR1YWxUcmVlLCBoOiBDcmVhdGVFbGVtZW50KSA9PiBWTm9kZTtcclxuICBtZXRob2RzPzogeyBba2V5OiBzdHJpbmddOiAodGhpczogVmlydHVhbFRyZWUsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkgfVxyXG4gIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQgKHZ4ZXRhYmxlOiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICBjb25zdCB7IHNldHVwLCB0IH0gPSB2eGV0YWJsZVxyXG4gIGNvbnN0IEdsb2JhbENvbmZpZyA9IHNldHVwKHt9KVxyXG4gIGNvbnN0IHByb3BLZXlzID0gT2JqZWN0LmtleXMoKFRhYmxlIGFzIGFueSkucHJvcHMpLmZpbHRlcihuYW1lID0+IFsnZGF0YScsICd0cmVlQ29uZmlnJ10uaW5kZXhPZihuYW1lKSA9PT0gLTEpXHJcblxyXG4gIGNvbnN0IG9wdGlvbnM6IFZpcnR1YWxUcmVlT3B0aW9ucyA9IHtcclxuICAgIG5hbWU6ICdWeGVWaXJ0dWFsVHJlZScsXHJcbiAgICBleHRlbmRzOiBHcmlkLFxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVtb3ZlTGlzdDogW10sXHJcbiAgICAgICAgdHJlZUxhenlMb2FkZWRzOiBbXVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgdHJlZU9wdHMgKCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBHbG9iYWxDb25maWcudGFibGUudHJlZUNvbmZpZywgdGhpcy50cmVlQ29uZmlnKVxyXG4gICAgICB9LFxyXG4gICAgICBjaGVja2JveE9wdHMgKCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBHbG9iYWxDb25maWcudGFibGUuY2hlY2tib3hDb25maWcsIHRoaXMuY2hlY2tib3hDb25maWcpXHJcbiAgICAgIH0sXHJcbiAgICAgIHRhYmxlRXh0ZW5kUHJvcHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fVxyXG4gICAgICAgIHByb3BLZXlzLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgIHJlc3Rba2V5XSA9IHRoaXNba2V5XVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHJlc3QuY2hlY2tib3hDb25maWcpIHtcclxuICAgICAgICAgIHJlc3QuY2hlY2tib3hDb25maWcgPSB0aGlzLmNoZWNrYm94T3B0c1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgY29sdW1ucyAodmFsdWU6IENvbHVtbk9wdGlvbnNbXSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQ29sdW1ucyh2YWx1ZSlcclxuICAgICAgfSxcclxuICAgICAgZGF0YSAodmFsdWU6IGFueVtdKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkRGF0YSh2YWx1ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNyZWF0ZWQgKCkge1xyXG4gICAgICBjb25zdCB7ICR2eGUsIHRyZWVPcHRzLCBkYXRhLCBjb2x1bW5zIH0gPSB0aGlzXHJcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgIGZ1bGxUcmVlRGF0YTogW10sXHJcbiAgICAgICAgdHJlZVRhYmxlRGF0YTogW10sXHJcbiAgICAgICAgZnVsbFRyZWVSb3dNYXA6IG5ldyBNYXAoKVxyXG4gICAgICB9KVxyXG4gICAgICBpZiAodGhpcy5rZWVwU291cmNlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcigkdnhlLnQoJ3Z4ZS5lcnJvci5ub3RQcm9wJywgWydrZWVwLXNvdXJjZSddKSlcclxuICAgICAgfVxyXG4gICAgICBpZiAodHJlZU9wdHMubGluZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJHZ4ZS50KCd2eGUuZXJyb3Iubm90UHJvcCcsIFsnY2hlY2tib3gtY29uZmlnLmxpbmUnXSkpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNvbHVtbnMpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZUNvbHVtbnMoY29sdW1ucylcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMucmVsb2FkRGF0YShkYXRhKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyIChoOiBDcmVhdGVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IHsgdlNpemUsIGlzWk1heCB9ID0gdGhpc1xyXG4gICAgICBjb25zdCAkc2NvcGVkU2xvdHM6IGFueSA9IHRoaXMuJHNjb3BlZFNsb3RzXHJcbiAgICAgIGNvbnN0IGhhc0Zvcm0gPSAhISgkc2NvcGVkU2xvdHMuZm9ybSB8fCB0aGlzLmZvcm1Db25maWcpXHJcbiAgICAgIGNvbnN0IGhhc1Rvb2xiYXIgPSAhISgkc2NvcGVkU2xvdHMudG9vbGJhciB8fCB0aGlzLnRvb2xiYXJDb25maWcgfHwgdGhpcy50b29sYmFyKVxyXG4gICAgICBjb25zdCBoYXNQYWdlciA9ICEhKCRzY29wZWRTbG90cy5wYWdlciB8fCB0aGlzLnBhZ2VyQ29uZmlnKVxyXG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICAgIGNsYXNzOiBbJ3Z4ZS1ncmlkJywgJ3Z4ZS12aXJ0dWFsLXRyZWUnLCB7XHJcbiAgICAgICAgICBbYHNpemUtLSR7dlNpemV9YF06IHZTaXplLFxyXG4gICAgICAgICAgJ3QtLWFuaW1hdCc6ICEhdGhpcy5hbmltYXQsXHJcbiAgICAgICAgICAnaXMtLXJvdW5kJzogdGhpcy5yb3VuZCxcclxuICAgICAgICAgICdpcy0tbWF4aW1pemUnOiBpc1pNYXgsXHJcbiAgICAgICAgICAnaXMtLWxvYWRpbmcnOiB0aGlzLmxvYWRpbmcgfHwgdGhpcy50YWJsZUxvYWRpbmdcclxuICAgICAgICB9XSxcclxuICAgICAgICBzdHlsZTogdGhpcy5yZW5kZXJTdHlsZVxyXG4gICAgICB9LCBbXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5riy5p+T6KGo5Y2VXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaGFzRm9ybVxyXG4gICAgICAgICAgPyBoKCdkaXYnLCB7XHJcbiAgICAgICAgICAgICAgcmVmOiAnZm9ybVdyYXBwZXInLFxyXG4gICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiAndnhlLWdyaWQtLWZvcm0td3JhcHBlcidcclxuICAgICAgICAgICAgfSwgJHNjb3BlZFNsb3RzLmZvcm1cclxuICAgICAgICAgICAgICA/ICRzY29wZWRTbG90cy5mb3JtLmNhbGwodGhpcywgeyAkZ3JpZDogdGhpcyB9LCBoKVxyXG4gICAgICAgICAgICAgIDogcmVuZGVyRGVmYXVsdEZvcm0oaCwgdGhpcylcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgOiBudWxsLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOa4suafk+W3peWFt+agj1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGhhc1Rvb2xiYXJcclxuICAgICAgICAgID8gaCgnZGl2Jywge1xyXG4gICAgICAgICAgICAgIHJlZjogJ3Rvb2xiYXJXcmFwcGVyJyxcclxuICAgICAgICAgICAgICBjbGFzczogJ3Z4ZS1ncmlkLS10b29sYmFyLXdyYXBwZXInXHJcbiAgICAgICAgICAgIH0sICRzY29wZWRTbG90cy50b29sYmFyXHJcbiAgICAgICAgICAgICAgPyAkc2NvcGVkU2xvdHMudG9vbGJhci5jYWxsKHRoaXMsIHsgJGdyaWQ6IHRoaXMgfSwgaClcclxuICAgICAgICAgICAgICA6IFtcclxuICAgICAgICAgICAgICAgICAgaCgndnhlLXRvb2xiYXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHRoaXMudG9vbGJhck9wdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmOiAneFRvb2xiYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlZFNsb3RzOiBnZXRUb29sYmFyU2xvdHModGhpcylcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgOiBudWxsLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOa4suafk+ihqOagvOmhtumDqOWMuuWfn1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZWRTbG90cy50b3BcclxuICAgICAgICAgID8gaCgnZGl2Jywge1xyXG4gICAgICAgICAgICAgIHJlZjogJ3RvcFdyYXBwZXInLFxyXG4gICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiAndnhlLWdyaWQtLXRvcC13cmFwcGVyJ1xyXG4gICAgICAgICAgICB9LCAkc2NvcGVkU2xvdHMudG9wLmNhbGwodGhpcywgeyAkZ3JpZDogdGhpcyB9LCBoKSlcclxuICAgICAgICAgIDogbnVsbCxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmuLLmn5PooajmoLxcclxuICAgICAgICAgKi9cclxuICAgICAgICBoKCd2eGUtdGFibGUnLCB7XHJcbiAgICAgICAgICBwcm9wczogdGhpcy50YWJsZVByb3BzLFxyXG4gICAgICAgICAgb246IGdldFRhYmxlT25zKHRoaXMpLFxyXG4gICAgICAgICAgc2NvcGVkU2xvdHM6ICRzY29wZWRTbG90cyxcclxuICAgICAgICAgIHJlZjogJ3hUYWJsZSdcclxuICAgICAgICB9KSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmuLLmn5PooajmoLzlupXpg6jljLrln59cclxuICAgICAgICAgKi9cclxuICAgICAgICAkc2NvcGVkU2xvdHMuYm90dG9tXHJcbiAgICAgICAgICA/IGgoJ2RpdicsIHtcclxuICAgICAgICAgICAgICByZWY6ICdib3R0b21XcmFwcGVyJyxcclxuICAgICAgICAgICAgICBzdGF0aWNDbGFzczogJ3Z4ZS1ncmlkLS1ib3R0b20td3JhcHBlcidcclxuICAgICAgICAgICAgfSwgJHNjb3BlZFNsb3RzLmJvdHRvbS5jYWxsKHRoaXMsIHsgJGdyaWQ6IHRoaXMgfSwgaCkpXHJcbiAgICAgICAgICA6IG51bGwsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5riy5p+T5YiG6aG1XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaGFzUGFnZXJcclxuICAgICAgICAgID8gaCgnZGl2Jywge1xyXG4gICAgICAgICAgICAgIHJlZjogJ3BhZ2VyV3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgc3RhdGljQ2xhc3M6ICd2eGUtZ3JpZC0tcGFnZXItd3JhcHBlcidcclxuICAgICAgICAgICAgfSwgJHNjb3BlZFNsb3RzLnBhZ2VyXHJcbiAgICAgICAgICAgICAgPyAkc2NvcGVkU2xvdHMucGFnZXIuY2FsbCh0aGlzLCB7ICRncmlkOiB0aGlzIH0sIGgpXHJcbiAgICAgICAgICAgICAgOiBbXHJcbiAgICAgICAgICAgICAgICAgIGgoJ3Z4ZS1wYWdlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wczogdGhpcy5wYWdlclByb3BzLFxyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAncGFnZS1jaGFuZ2UnOiB0aGlzLnBhZ2VDaGFuZ2VFdmVudFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVkU2xvdHM6IGdldFBhZ2VyU2xvdHModGhpcylcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgOiBudWxsXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBsb2FkQ29sdW1uIChjb2x1bW5zOiBDb2x1bW5PcHRpb25zW10pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kbmV4dFRpY2soKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHsgJHZ4ZSwgJHNjb3BlZFNsb3RzLCByZW5kZXJUcmVlSWNvbiwgdHJlZU9wdHMgfSA9IHRoaXNcclxuICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUoY29sdW1ucywgY29sdW1uID0+IHtcclxuICAgICAgICAgICAgaWYgKGNvbHVtbi50cmVlTm9kZSkge1xyXG4gICAgICAgICAgICAgIGlmICghY29sdW1uLnNsb3RzKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW4uc2xvdHMgPSB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBjb2x1bW4uc2xvdHMuaWNvbiA9IHJlbmRlclRyZWVJY29uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbHVtbi5zbG90cykge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuZWFjaChjb2x1bW4uc2xvdHMsIChmdW5jLCBuYW1lLCBjb2xTbG90czogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyDlhbzlrrkgdjJcclxuICAgICAgICAgICAgICAgIGlmICghWEVVdGlscy5pc0Z1bmN0aW9uKGZ1bmMpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGVkU2xvdHNbZnVuY10pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xTbG90c1tuYW1lXSA9ICRzY29wZWRTbG90c1tmdW5jXVxyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbFNsb3RzW25hbWVdID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJHZ4ZS50KCd2eGUuZXJyb3Iubm90U2xvdCcsIFtmdW5jXSkpXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCB0cmVlT3B0cylcclxuICAgICAgICAgIHRoaXMuJHJlZnMueFRhYmxlLmxvYWRDb2x1bW4oY29sdW1ucylcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgICByZW5kZXJUcmVlSWNvbiAocGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zLCBoOiBDcmVhdGVFbGVtZW50LCBjZWxsVk5vZGVzOiBWTm9kZUNoaWxkcmVuKSB7XHJcbiAgICAgICAgY29uc3QgeyB0cmVlTGF6eUxvYWRlZHMsIHRyZWVPcHRzIH0gPSB0aGlzXHJcbiAgICAgICAgY29uc3QgeyBpc0hpZGRlbiwgcm93IH0gPSBwYXJhbXNcclxuICAgICAgICBjb25zdCB7IGNoaWxkcmVuLCBoYXNDaGlsZCwgaW5kZW50LCBsYXp5LCB0cmlnZ2VyLCBpY29uTG9hZGVkLCBzaG93SWNvbiwgaWNvbk9wZW4sIGljb25DbG9zZSB9ID0gdHJlZU9wdHNcclxuICAgICAgICBjb25zdCByb3dDaGlsZHMgPSByb3dbY2hpbGRyZW5dXHJcbiAgICAgICAgbGV0IGhhc0xhenlDaGlsZHMgPSBmYWxzZVxyXG4gICAgICAgIGxldCBpc0FjZWl2ZWQgPSBmYWxzZVxyXG4gICAgICAgIGxldCBpc0xhenlMb2FkZWQgPSBmYWxzZVxyXG4gICAgICAgIGNvbnN0IG9uOiB7IFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fVxyXG4gICAgICAgIGlmICghaXNIaWRkZW4pIHtcclxuICAgICAgICAgIGlzQWNlaXZlZCA9IHJvdy5fWF9FWFBBTkRcclxuICAgICAgICAgIGlmIChsYXp5KSB7XHJcbiAgICAgICAgICAgIGlzTGF6eUxvYWRlZCA9IHRyZWVMYXp5TG9hZGVkcy5pbmRleE9mKHJvdykgPiAtMVxyXG4gICAgICAgICAgICBoYXNMYXp5Q2hpbGRzID0gcm93W2hhc0NoaWxkXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRyaWdnZXIgfHwgdHJpZ2dlciA9PT0gJ2RlZmF1bHQnKSB7XHJcbiAgICAgICAgICBvbi5jbGljayA9IChldm50OiBFdmVudCkgPT4gdGhpcy50cmlnZ2VyVHJlZUV4cGFuZEV2ZW50KGV2bnQsIHBhcmFtcylcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICAgICAgY2xhc3M6IFsndnhlLWNlbGwtLXRyZWUtbm9kZScsIHtcclxuICAgICAgICAgICAgICAnaXMtLWFjdGl2ZSc6IGlzQWNlaXZlZFxyXG4gICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICBwYWRkaW5nTGVmdDogYCR7cm93Ll9YX0xFVkVMICogaW5kZW50fXB4YFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgIHNob3dJY29uICYmICgocm93Q2hpbGRzICYmIHJvd0NoaWxkcy5sZW5ndGgpIHx8IGhhc0xhenlDaGlsZHMpXHJcbiAgICAgICAgICAgICAgPyBbXHJcbiAgICAgICAgICAgICAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Z4ZS10cmVlLS1idG4td3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgb25cclxuICAgICAgICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoJ2knLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzczogWyd2eGUtdHJlZS0tbm9kZS1idG4nLCBpc0xhenlMb2FkZWQgPyAoaWNvbkxvYWRlZCB8fCBHbG9iYWxDb25maWcuaWNvbi5UQUJMRV9UUkVFX0xPQURFRCkgOiAoaXNBY2VpdmVkID8gKGljb25PcGVuIHx8IEdsb2JhbENvbmZpZy5pY29uLlRBQkxFX1RSRUVfT1BFTikgOiAoaWNvbkNsb3NlIHx8IEdsb2JhbENvbmZpZy5pY29uLlRBQkxFX1RSRUVfQ0xPU0UpKV1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIDogbnVsbCxcclxuICAgICAgICAgICAgaCgnZGl2Jywge1xyXG4gICAgICAgICAgICAgIGNsYXNzOiAndnhlLXRyZWUtY2VsbCdcclxuICAgICAgICAgICAgfSwgY2VsbFZOb2RlcylcclxuICAgICAgICAgIF0pXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICBfbG9hZFRyZWVEYXRhIChkYXRhOiBhbnlbXSkge1xyXG4gICAgICAgIGNvbnN0IHsgaGlnaGxpZ2h0Q3VycmVudFJvdyB9ID0gdGhpc1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdFJvdyA9IHRoaXMuZ2V0UmFkaW9SZWNvcmQoKVxyXG4gICAgICAgIGxldCBjdXJyZW50Um93OiBhbnlcclxuICAgICAgICBpZiAoaGlnaGxpZ2h0Q3VycmVudFJvdykge1xyXG4gICAgICAgICAgY3VycmVudFJvdyA9IHRoaXMuZ2V0Q3VycmVudFJlY29yZCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLiRuZXh0VGljaygpXHJcbiAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLiRyZWZzLnhUYWJsZS5sb2FkRGF0YShkYXRhKSlcclxuICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdFJvdykge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0UmFkaW9Sb3coc2VsZWN0Um93KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChoaWdobGlnaHRDdXJyZW50Um93ICYmIGN1cnJlbnRSb3cpIHtcclxuICAgICAgICAgICAgICB0aGlzLnNldEN1cnJlbnRSb3coY3VycmVudFJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZ2V0RGF0YSAocm93SW5kZXg/OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB7IGZ1bGxUcmVlRGF0YSB9ID0gdGhpc1xyXG4gICAgICAgIHJldHVybiBYRVV0aWxzLmlzVW5kZWZpbmVkKHJvd0luZGV4KSA/IGZ1bGxUcmVlRGF0YS5zbGljZSgwKSA6IGZ1bGxUcmVlRGF0YVtyb3dJbmRleF1cclxuICAgICAgfSxcclxuICAgICAgbG9hZERhdGEgKGRhdGE6IGFueVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRUcmVlRGF0YSh0aGlzLnRvVmlydHVhbFRyZWUoZGF0YSkpXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlbG9hZERhdGEgKGRhdGE6IGFueVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJG5leHRUaWNrKClcclxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuJHJlZnMueFRhYmxlLnJlbG9hZERhdGEodGhpcy50b1ZpcnR1YWxUcmVlKGRhdGEpKSlcclxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuaGFuZGxlRGVmYXVsdFRyZWVFeHBhbmQoKSlcclxuICAgICAgfSxcclxuICAgICAgaXNUcmVlRXhwYW5kQnlSb3cgKHJvdzogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuICEhcm93Ll9YX0VYUEFORFxyXG4gICAgICB9LFxyXG4gICAgICBzZXRUcmVlRXhwYW5zaW9uIChyb3dzOiBhbnkgfCBhbnlbXSwgZXhwYW5kZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRUcmVlRXhwYW5kKHJvd3MsIGV4cGFuZGVkKVxyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGVBc3luY1RyZWVFeHBhbmRDaGlsZHMgKHJvdzogYW55KSB7XHJcbiAgICAgICAgY29uc3QgeyB0cmVlTGF6eUxvYWRlZHMsIHRyZWVPcHRzLCBjaGVja2JveE9wdHMgfSA9IHRoaXNcclxuICAgICAgICBjb25zdCB7IGxvYWRNZXRob2QsIGNoaWxkcmVuIH0gPSB0cmVlT3B0c1xyXG4gICAgICAgIGNvbnN0IHsgY2hlY2tTdHJpY3RseSB9ID0gY2hlY2tib3hPcHRzXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgaWYgKGxvYWRNZXRob2QpIHtcclxuICAgICAgICAgICAgdHJlZUxhenlMb2FkZWRzLnB1c2gocm93KVxyXG4gICAgICAgICAgICBsb2FkTWV0aG9kKHsgcm93IH0pLmNhdGNoKCgpID0+IFtdKS50aGVuKChjaGlsZHM6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgcm93Ll9YX0xPQURFRCA9IHRydWVcclxuICAgICAgICAgICAgICBYRVV0aWxzLnJlbW92ZSh0cmVlTGF6eUxvYWRlZHMsIGl0ZW0gPT4gaXRlbSA9PT0gcm93KVxyXG4gICAgICAgICAgICAgIGlmICghWEVVdGlscy5pc0FycmF5KGNoaWxkcykpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcyA9IFtdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChjaGlsZHMpIHtcclxuICAgICAgICAgICAgICAgIHJvd1tjaGlsZHJlbl0gPSBjaGlsZHMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpdGVtLl9YX0xPQURFRCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW0uX1hfRVhQQU5EID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgaXRlbS5fWF9JTlNFUlQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICBpdGVtLl9YX0xFVkVMID0gcm93Ll9YX0xFVkVMICsgMVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZHMubGVuZ3RoICYmICFyb3cuX1hfRVhQQU5EKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudmlydHVhbEV4cGFuZChyb3csIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlvZPliY3oioLngrnlt7LpgInkuK3vvIzliJnlsZXlvIDlkI7lrZDoioLngrnkuZ/ooqvpgInkuK1cclxuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdHJpY3RseSAmJiB0aGlzLmlzQ2hlY2tlZEJ5Q2hlY2tib3hSb3cocm93KSkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnNldENoZWNrYm94Um93KGNoaWxkcywgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLiRuZXh0VGljaygpLnRoZW4oKCkgPT4gdGhpcy5yZWNhbGN1bGF0ZSgpKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUobnVsbClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgICBzZXRUcmVlRXhwYW5kIChyb3dzOiBhbnksIGV4cGFuZGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgeyB0cmVlTGF6eUxvYWRlZHMsIHRyZWVPcHRzLCB0YWJsZUZ1bGxEYXRhLCB0cmVlTm9kZUNvbHVtbiB9ID0gdGhpc1xyXG4gICAgICAgIGNvbnN0IHsgbGF6eSwgaGFzQ2hpbGQsIGFjY29yZGlvbiwgdG9nZ2xlTWV0aG9kIH0gPSB0cmVlT3B0c1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXVxyXG4gICAgICAgIGlmIChyb3dzKSB7XHJcbiAgICAgICAgICBpZiAoIVhFVXRpbHMuaXNBcnJheShyb3dzKSkge1xyXG4gICAgICAgICAgICByb3dzID0gW3Jvd3NdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgodHJlZU5vZGVDb2x1bW4pXHJcbiAgICAgICAgICBjb25zdCAkY29sdW1uSW5kZXggPSB0aGlzLmdldFZNQ29sdW1uSW5kZXgodHJlZU5vZGVDb2x1bW4pXHJcbiAgICAgICAgICBsZXQgdmFsaWRSb3dzID0gdG9nZ2xlTWV0aG9kID8gcm93cy5maWx0ZXIoKHJvdzogYW55KSA9PiB0b2dnbGVNZXRob2QoeyBleHBhbmRlZCwgY29sdW1uOiB0cmVlTm9kZUNvbHVtbiwgcm93LCBjb2x1bW5JbmRleCwgJGNvbHVtbkluZGV4IH0pKSA6IHJvd3NcclxuICAgICAgICAgIGlmIChhY2NvcmRpb24pIHtcclxuICAgICAgICAgICAgdmFsaWRSb3dzID0gdmFsaWRSb3dzLmxlbmd0aCA/IFt2YWxpZFJvd3NbdmFsaWRSb3dzLmxlbmd0aCAtIDFdXSA6IFtdXHJcbiAgICAgICAgICAgIC8vIOWQjOS4gOe6p+WPquiDveWxleW8gOS4gOS4qlxyXG4gICAgICAgICAgICBjb25zdCBtYXRjaE9iaiA9IFhFVXRpbHMuZmluZFRyZWUodGFibGVGdWxsRGF0YSBhcyBhbnlbXSwgaXRlbSA9PiBpdGVtID09PSByb3dzWzBdLCB0cmVlT3B0cylcclxuICAgICAgICAgICAgaWYgKG1hdGNoT2JqKSB7XHJcbiAgICAgICAgICAgICAgbWF0Y2hPYmouaXRlbXMuZm9yRWFjaCgocm93KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByb3cuX1hfRVhQQU5EID0gZmFsc2VcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YWxpZFJvd3MuZm9yRWFjaCgocm93OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaXNMb2FkID0gbGF6eSAmJiByb3dbaGFzQ2hpbGRdICYmICFyb3cuX1hfTE9BREVEICYmIHRyZWVMYXp5TG9hZGVkcy5pbmRleE9mKHJvdykgPT09IC0xXHJcbiAgICAgICAgICAgIC8vIOaYr+WQpuS9v+eUqOaHkuWKoOi9vVxyXG4gICAgICAgICAgICBpZiAoZXhwYW5kZWQgJiYgaXNMb2FkKSB7XHJcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5oYW5kbGVBc3luY1RyZWVFeHBhbmRDaGlsZHMocm93KSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAoaGFzQ2hpbGRzKHRoaXMsIHJvdykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlydHVhbEV4cGFuZChyb3csICEhZXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvYWRUcmVlRGF0YSh0aGlzLnRyZWVUYWJsZURhdGEpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlY2FsY3VsYXRlKClcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLiRuZXh0VGljaygpXHJcbiAgICAgIH0sXHJcbiAgICAgIHNldEFsbFRyZWVFeHBhbnNpb24gKGV4cGFuZGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWxsVHJlZUV4cGFuZChleHBhbmRlZClcclxuICAgICAgfSxcclxuICAgICAgc2V0QWxsVHJlZUV4cGFuZCAoZXhwYW5kZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFRyZWVEYXRhKHRoaXMudmlydHVhbEFsbEV4cGFuZChleHBhbmRlZCkpXHJcbiAgICAgIH0sXHJcbiAgICAgIHRvZ2dsZVRyZWVFeHBhbnNpb24gKHJvdzogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlVHJlZUV4cGFuZChyb3cpXHJcbiAgICAgIH0sXHJcbiAgICAgIHRyaWdnZXJUcmVlRXhwYW5kRXZlbnQgKGV2bnQ6IEV2ZW50LCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgICBjb25zdCB7IHRyZWVPcHRzLCB0cmVlTGF6eUxvYWRlZHMgfSA9IHRoaXNcclxuICAgICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgICBjb25zdCB7IGxhenkgfSA9IHRyZWVPcHRzXHJcbiAgICAgICAgaWYgKCFsYXp5IHx8IHRyZWVMYXp5TG9hZGVkcy5pbmRleE9mKHJvdykgPT09IC0xKSB7XHJcbiAgICAgICAgICBjb25zdCBleHBhbmRlZCA9ICF0aGlzLmlzVHJlZUV4cGFuZEJ5Um93KHJvdylcclxuICAgICAgICAgIHRoaXMuc2V0VHJlZUV4cGFuZChyb3csIGV4cGFuZGVkKVxyXG4gICAgICAgICAgdGhpcy4kZW1pdCgndG9nZ2xlLXRyZWUtZXhwYW5kJywgeyBleHBhbmRlZCwgY29sdW1uLCByb3csICRldmVudDogZXZudCB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgdG9nZ2xlVHJlZUV4cGFuZCAocm93OiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFRyZWVEYXRhKHRoaXMudmlydHVhbEV4cGFuZChyb3csICFyb3cuX1hfRVhQQU5EKSlcclxuICAgICAgfSxcclxuICAgICAgZ2V0VHJlZUV4cGFuZFJlY29yZHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZnVsbFRyZWVEYXRhLCB0cmVlT3B0cyB9ID0gdGhpc1xyXG4gICAgICAgIGNvbnN0IHRyZWVFeHBhbmRSZWNvcmRzOiBhbnlbXSA9IFtdXHJcbiAgICAgICAgWEVVdGlscy5lYWNoVHJlZShmdWxsVHJlZURhdGEsIHJvdyA9PiB7XHJcbiAgICAgICAgICBpZiAocm93Ll9YX0VYUEFORCAmJiBoYXNDaGlsZHModGhpcywgcm93KSkge1xyXG4gICAgICAgICAgICB0cmVlRXhwYW5kUmVjb3Jkcy5wdXNoKHJvdylcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB0cmVlT3B0cylcclxuICAgICAgICByZXR1cm4gdHJlZUV4cGFuZFJlY29yZHNcclxuICAgICAgfSxcclxuICAgICAgY2xlYXJUcmVlRXhwYW5kICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRBbGxUcmVlRXhwYW5kKGZhbHNlKVxyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGVDb2x1bW5zIChjb2x1bW5zOiBDb2x1bW5PcHRpb25zW10pIHtcclxuICAgICAgICBjb25zdCB7ICR2eGUsIHJlbmRlclRyZWVJY29uLCBjaGVja2JveE9wdHMgfSA9IHRoaXNcclxuICAgICAgICBpZiAoY29sdW1ucykge1xyXG4gICAgICAgICAgaWYgKCghY2hlY2tib3hPcHRzLmNoZWNrRmllbGQgfHwgIWNoZWNrYm94T3B0cy5oYWxmRmllbGQpICYmIGNvbHVtbnMuc29tZShjb25mID0+IGNvbmYudHlwZSA9PT0gJ2NoZWNrYm94JykpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcigkdnhlLnQoJ3Z4ZS5lcnJvci5yZXFQcm9wJywgWyd0YWJsZS5jaGVja2JveC1jb25maWcuY2hlY2tGaWVsZCB8IHRhYmxlLmNoZWNrYm94LWNvbmZpZy5oYWxmRmllbGQnXSkpXHJcbiAgICAgICAgICAgIHJldHVybiBbXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgdHJlZU5vZGVDb2x1bW4gPSBjb2x1bW5zLmZpbmQoY29uZiA9PiBjb25mLnRyZWVOb2RlKVxyXG4gICAgICAgICAgaWYgKHRyZWVOb2RlQ29sdW1uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNsb3RzID0gdHJlZU5vZGVDb2x1bW4uc2xvdHMgfHwge31cclxuICAgICAgICAgICAgc2xvdHMuaWNvbiA9IHJlbmRlclRyZWVJY29uXHJcbiAgICAgICAgICAgIHRyZWVOb2RlQ29sdW1uLnNsb3RzID0gc2xvdHNcclxuICAgICAgICAgICAgdGhpcy50cmVlTm9kZUNvbHVtbiA9IHRyZWVOb2RlQ29sdW1uXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gY29sdW1uc1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW11cclxuICAgICAgfSxcclxuICAgICAgLyoqXHJcbiAgICAgICAqIOiOt+WPluihqOagvOaVsOaNrumbhu+8jOWMheWQq+aWsOWinuOAgeWIoOmZpFxyXG4gICAgICAgKiDkuI3mlK/mjIHkv67mlLlcclxuICAgICAgICovXHJcbiAgICAgIGdldFJlY29yZHNldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGluc2VydFJlY29yZHM6IHRoaXMuZ2V0SW5zZXJ0UmVjb3JkcygpLFxyXG4gICAgICAgICAgcmVtb3ZlUmVjb3JkczogdGhpcy5nZXRSZW1vdmVSZWNvcmRzKCksXHJcbiAgICAgICAgICB1cGRhdGVSZWNvcmRzOiBbXVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgaXNJbnNlcnRCeVJvdyAocm93OiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gISFyb3cuX1hfSU5TRVJUXHJcbiAgICAgIH0sXHJcbiAgICAgIGdldEluc2VydFJlY29yZHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdHJlZU9wdHMgfSA9IHRoaXNcclxuICAgICAgICBjb25zdCBpbnNlcnRSZWNvcmRzOiBhbnlbXSA9IFtdXHJcbiAgICAgICAgWEVVdGlscy5lYWNoVHJlZSh0aGlzLmZ1bGxUcmVlRGF0YSwgcm93ID0+IHtcclxuICAgICAgICAgIGlmIChyb3cuX1hfSU5TRVJUKSB7XHJcbiAgICAgICAgICAgIGluc2VydFJlY29yZHMucHVzaChyb3cpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdHJlZU9wdHMpXHJcbiAgICAgICAgcmV0dXJuIGluc2VydFJlY29yZHNcclxuICAgICAgfSxcclxuICAgICAgaW5zZXJ0IChyZWNvcmRzOiBhbnkgfCBhbnlbXSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydEF0KHJlY29yZHMsIG51bGwpXHJcbiAgICAgIH0sXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDmlK/mjIHku7vmhI/lsYLnuqfmj5LlhaXkuI7liKDpmaRcclxuICAgICAgICovXHJcbiAgICAgIGluc2VydEF0IChyZWNvcmRzOiBhbnksIHJvdzogbnVtYmVyIHwgYW55IHwgbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IHsgZnVsbFRyZWVEYXRhLCB0cmVlVGFibGVEYXRhLCB0cmVlT3B0cyB9ID0gdGhpc1xyXG4gICAgICAgIGlmICghWEVVdGlscy5pc0FycmF5KHJlY29yZHMpKSB7XHJcbiAgICAgICAgICByZWNvcmRzID0gW3JlY29yZHNdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG5ld1JlY29yZHMgPSByZWNvcmRzLm1hcCgocmVjb3JkOiBhbnkpID0+IHRoaXMuZGVmaW5lRmllbGQoT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICBfWF9MT0FERUQ6IGZhbHNlLFxyXG4gICAgICAgICAgX1hfRVhQQU5EOiBmYWxzZSxcclxuICAgICAgICAgIF9YX0lOU0VSVDogdHJ1ZSxcclxuICAgICAgICAgIF9YX0xFVkVMOiAwXHJcbiAgICAgICAgfSwgcmVjb3JkKSkpXHJcbiAgICAgICAgaWYgKCFyb3cpIHtcclxuICAgICAgICAgIGZ1bGxUcmVlRGF0YS51bnNoaWZ0KC4uLm5ld1JlY29yZHMpXHJcbiAgICAgICAgICB0cmVlVGFibGVEYXRhLnVuc2hpZnQoLi4ubmV3UmVjb3JkcylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHJvdyA9PT0gLTEpIHtcclxuICAgICAgICAgICAgZnVsbFRyZWVEYXRhLnB1c2goLi4ubmV3UmVjb3JkcylcclxuICAgICAgICAgICAgdHJlZVRhYmxlRGF0YS5wdXNoKC4uLm5ld1JlY29yZHMpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBtYXRjaE9iaiA9IFhFVXRpbHMuZmluZFRyZWUoZnVsbFRyZWVEYXRhLCBpdGVtID0+IGl0ZW0gPT09IHJvdywgdHJlZU9wdHMpXHJcbiAgICAgICAgICAgIGlmICghbWF0Y2hPYmogfHwgbWF0Y2hPYmouaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHQoJ3Z4ZS5lcnJvci51bmFibGVJbnNlcnQnKSBhcyBzdHJpbmcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgeyBpdGVtcywgaW5kZXgsIG5vZGVzIH0gPSBtYXRjaE9ialxyXG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRyZWVUYWJsZURhdGEuaW5kZXhPZihyb3cpXHJcbiAgICAgICAgICAgIGlmIChyb3dJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgdHJlZVRhYmxlRGF0YS5zcGxpY2Uocm93SW5kZXgsIDAsIC4uLm5ld1JlY29yZHMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAwLCAuLi5uZXdSZWNvcmRzKVxyXG4gICAgICAgICAgICBuZXdSZWNvcmRzLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGl0ZW0uX1hfTEVWRUwgPSBub2Rlcy5sZW5ndGggLSAxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkVHJlZURhdGEodHJlZVRhYmxlRGF0YSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByb3c6IG5ld1JlY29yZHMubGVuZ3RoID8gbmV3UmVjb3Jkc1tuZXdSZWNvcmRzLmxlbmd0aCAtIDFdIDogbnVsbCxcclxuICAgICAgICAgICAgcm93czogbmV3UmVjb3Jkc1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDojrflj5blt7LliKDpmaTnmoTmlbDmja5cclxuICAgICAgICovXHJcbiAgICAgIGdldFJlbW92ZVJlY29yZHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxpc3RcclxuICAgICAgfSxcclxuICAgICAgcmVtb3ZlU2VsZWN0ZWRzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDaGVja2JveFJvdygpXHJcbiAgICAgIH0sXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDliKDpmaTpgInkuK3mlbDmja5cclxuICAgICAgICovXHJcbiAgICAgIHJlbW92ZUNoZWNrYm94Um93ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmUodGhpcy5nZXRDaGVja2JveFJlY29yZHMoKSkudGhlbigocGFyYW1zOiBhbnkpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKVxyXG4gICAgICAgICAgcmV0dXJuIHBhcmFtc1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlbW92ZSAocm93czogYW55KSB7XHJcbiAgICAgICAgY29uc3QgeyByZW1vdmVMaXN0LCBmdWxsVHJlZURhdGEsIHRyZWVPcHRzIH0gPSB0aGlzXHJcbiAgICAgICAgY29uc3QgcmVzdDogYW55W10gPSBbXVxyXG4gICAgICAgIGlmICghcm93cykge1xyXG4gICAgICAgICAgcm93cyA9IGZ1bGxUcmVlRGF0YVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIVhFVXRpbHMuaXNBcnJheShyb3dzKSkge1xyXG4gICAgICAgICAgcm93cyA9IFtyb3dzXVxyXG4gICAgICAgIH1cclxuICAgICAgICByb3dzLmZvckVhY2goKHJvdzogYW55KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBtYXRjaE9iaiA9IFhFVXRpbHMuZmluZFRyZWUoZnVsbFRyZWVEYXRhLCBpdGVtID0+IGl0ZW0gPT09IHJvdywgdHJlZU9wdHMpXHJcbiAgICAgICAgICBpZiAobWF0Y2hPYmopIHtcclxuICAgICAgICAgICAgY29uc3QgeyBpdGVtLCBpdGVtcywgaW5kZXgsIHBhcmVudCB9OiBhbnkgPSBtYXRjaE9ialxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNJbnNlcnRCeVJvdyhyb3cpKSB7XHJcbiAgICAgICAgICAgICAgcmVtb3ZlTGlzdC5wdXNoKHJvdylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgaXNFeHBhbmQgPSB0aGlzLmlzVHJlZUV4cGFuZEJ5Um93KHBhcmVudClcclxuICAgICAgICAgICAgICBpZiAoaXNFeHBhbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ29sbGFwc2luZyhwYXJlbnQpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSlcclxuICAgICAgICAgICAgICBpZiAoaXNFeHBhbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXhwYW5kaW5nKHBhcmVudClcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2xsYXBzaW5nKGl0ZW0pXHJcbiAgICAgICAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgICAgIHRoaXMudHJlZVRhYmxlRGF0YS5zcGxpY2UodGhpcy50cmVlVGFibGVEYXRhLmluZGV4T2YoaXRlbSksIDEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdC5wdXNoKGl0ZW0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFRyZWVEYXRhKHRoaXMudHJlZVRhYmxlRGF0YSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4geyByb3c6IHJlc3QubGVuZ3RoID8gcmVzdFtyZXN0Lmxlbmd0aCAtIDFdIDogbnVsbCwgcm93czogcmVzdCB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWkhOeQhum7mOiupOWxleW8gOagkeiKgueCuVxyXG4gICAgICAgKi9cclxuICAgICAgaGFuZGxlRGVmYXVsdFRyZWVFeHBhbmQgKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdHJlZUNvbmZpZywgdHJlZU9wdHMsIHRhYmxlRnVsbERhdGEgfSA9IHRoaXNcclxuICAgICAgICBpZiAodHJlZUNvbmZpZykge1xyXG4gICAgICAgICAgY29uc3QgeyBjaGlsZHJlbiwgZXhwYW5kQWxsLCBleHBhbmRSb3dLZXlzIH0gPSB0cmVlT3B0c1xyXG4gICAgICAgICAgaWYgKGV4cGFuZEFsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEFsbFRyZWVFeHBhbmQodHJ1ZSlcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZXhwYW5kUm93S2V5cyAmJiB0aGlzLnJvd0lkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd2tleSA9IHRoaXMucm93SWRcclxuICAgICAgICAgICAgZXhwYW5kUm93S2V5cy5mb3JFYWNoKChyb3dpZDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbWF0Y2hPYmogPSBYRVV0aWxzLmZpbmRUcmVlKHRhYmxlRnVsbERhdGEgYXMgYW55W10sIGl0ZW0gPT4gcm93aWQgPT09IFhFVXRpbHMuZ2V0KGl0ZW0sIHJvd2tleSksIHRyZWVPcHRzKVxyXG4gICAgICAgICAgICAgIGNvbnN0IHJvd0NoaWxkcmVuID0gbWF0Y2hPYmogPyBtYXRjaE9iai5pdGVtW2NoaWxkcmVuXSA6IDBcclxuICAgICAgICAgICAgICBpZiAocm93Q2hpbGRyZW4gJiYgcm93Q2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyZWVFeHBhbmQobWF0Y2hPYmouaXRlbSwgdHJ1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAvKipcclxuICAgICAgICog5a6a5LmJ5qCR5bGe5oCnXHJcbiAgICAgICAqL1xyXG4gICAgICB0b1ZpcnR1YWxUcmVlICh0cmVlRGF0YTogYW55W10pIHtcclxuICAgICAgICBjb25zdCB7IHRyZWVPcHRzIH0gPSB0aGlzXHJcbiAgICAgICAgY29uc3QgZnVsbFRyZWVSb3dNYXAgPSB0aGlzLmZ1bGxUcmVlUm93TWFwXHJcbiAgICAgICAgZnVsbFRyZWVSb3dNYXAuY2xlYXIoKVxyXG4gICAgICAgIFhFVXRpbHMuZWFjaFRyZWUodHJlZURhdGEsIChpdGVtLCBpbmRleCwgaXRlbXMsIHBhdGhzLCBwYXJlbnQsIG5vZGVzKSA9PiB7XHJcbiAgICAgICAgICBpdGVtLl9YX0xPQURFRCA9IGZhbHNlXHJcbiAgICAgICAgICBpdGVtLl9YX0VYUEFORCA9IGZhbHNlXHJcbiAgICAgICAgICBpdGVtLl9YX0lOU0VSVCA9IGZhbHNlXHJcbiAgICAgICAgICBpdGVtLl9YX0xFVkVMID0gbm9kZXMubGVuZ3RoIC0gMVxyXG4gICAgICAgICAgZnVsbFRyZWVSb3dNYXAuc2V0KGl0ZW0sIHsgaXRlbSwgaW5kZXgsIGl0ZW1zLCBwYXRocywgcGFyZW50LCBub2RlcyB9KVxyXG4gICAgICAgIH0sIHRyZWVPcHRzKVxyXG4gICAgICAgIHRoaXMuZnVsbFRyZWVEYXRhID0gdHJlZURhdGEuc2xpY2UoMClcclxuICAgICAgICB0aGlzLnRyZWVUYWJsZURhdGEgPSB0cmVlRGF0YS5zbGljZSgwKVxyXG4gICAgICAgIHJldHVybiB0cmVlRGF0YVxyXG4gICAgICB9LFxyXG4gICAgICAvKipcclxuICAgICAgICog5bGV5byAL+aUtui1t+agkeiKgueCuVxyXG4gICAgICAgKi9cclxuICAgICAgdmlydHVhbEV4cGFuZCAocm93OiBhbnksIGV4cGFuZGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgeyB0cmVlT3B0cywgdHJlZU5vZGVDb2x1bW4gfSA9IHRoaXNcclxuICAgICAgICBjb25zdCB7IHRvZ2dsZU1ldGhvZCB9ID0gdHJlZU9wdHNcclxuICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgodHJlZU5vZGVDb2x1bW4pXHJcbiAgICAgICAgY29uc3QgJGNvbHVtbkluZGV4ID0gdGhpcy5nZXRWTUNvbHVtbkluZGV4KHRyZWVOb2RlQ29sdW1uKVxyXG4gICAgICAgIGlmICghdG9nZ2xlTWV0aG9kIHx8IHRvZ2dsZU1ldGhvZCh7IGV4cGFuZGVkLCByb3csIGNvbHVtbjogdHJlZU5vZGVDb2x1bW4sIGNvbHVtbkluZGV4LCAkY29sdW1uSW5kZXggfSkpIHtcclxuICAgICAgICAgIGlmIChyb3cuX1hfRVhQQU5EICE9PSBleHBhbmRlZCkge1xyXG4gICAgICAgICAgICBpZiAocm93Ll9YX0VYUEFORCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ29sbGFwc2luZyhyb3cpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFeHBhbmRpbmcocm93KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWVUYWJsZURhdGFcclxuICAgICAgfSxcclxuICAgICAgLy8g5bGV5byA6IqC54K5XHJcbiAgICAgIGhhbmRsZUV4cGFuZGluZyAocm93OiBhbnkpIHtcclxuICAgICAgICBpZiAoaGFzQ2hpbGRzKHRoaXMsIHJvdykpIHtcclxuICAgICAgICAgIGNvbnN0IHsgdHJlZVRhYmxlRGF0YSwgdHJlZU9wdHMgfSA9IHRoaXNcclxuICAgICAgICAgIGNvbnN0IGNoaWxkUm93cyA9IHJvd1t0cmVlT3B0cy5jaGlsZHJlbl1cclxuICAgICAgICAgIGNvbnN0IGV4cGFuZExpc3Q6IGFueVtdID0gW11cclxuICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gdHJlZVRhYmxlRGF0YS5pbmRleE9mKHJvdylcclxuICAgICAgICAgIGlmIChyb3dJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBhbmRpbmcgZXJyb3InKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgZXhwYW5kTWFwczogTWFwPGFueSwgTnVtYmVyPiA9IG5ldyBNYXAoKVxyXG4gICAgICAgICAgWEVVdGlscy5lYWNoVHJlZShjaGlsZFJvd3MsIChpdGVtLCBpbmRleCwgb2JqLCBwYXRocywgcGFyZW50LCBub2RlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXBhcmVudCB8fCAocGFyZW50Ll9YX0VYUEFORCAmJiBleHBhbmRNYXBzLmhhcyhwYXJlbnQpKSkge1xyXG4gICAgICAgICAgICAgIGV4cGFuZE1hcHMuc2V0KGl0ZW0sIDEpXHJcbiAgICAgICAgICAgICAgZXhwYW5kTGlzdC5wdXNoKGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHRyZWVPcHRzKVxyXG4gICAgICAgICAgcm93Ll9YX0VYUEFORCA9IHRydWVcclxuICAgICAgICAgIHRyZWVUYWJsZURhdGEuc3BsaWNlKHJvd0luZGV4ICsgMSwgMCwgLi4uZXhwYW5kTGlzdClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZVRhYmxlRGF0YVxyXG4gICAgICB9LFxyXG4gICAgICAvLyDmlLbotbfoioLngrlcclxuICAgICAgaGFuZGxlQ29sbGFwc2luZyAocm93OiBhbnkpIHtcclxuICAgICAgICBpZiAoaGFzQ2hpbGRzKHRoaXMsIHJvdykpIHtcclxuICAgICAgICAgIGNvbnN0IHsgdHJlZVRhYmxlRGF0YSwgdHJlZU9wdHMgfSA9IHRoaXNcclxuICAgICAgICAgIGNvbnN0IGNoaWxkUm93cyA9IHJvd1t0cmVlT3B0cy5jaGlsZHJlbl1cclxuICAgICAgICAgIGNvbnN0IG5vZGVDaGlsZExpc3Q6IGFueVtdID0gW11cclxuICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUoY2hpbGRSb3dzLCBpdGVtID0+IHtcclxuICAgICAgICAgICAgbm9kZUNoaWxkTGlzdC5wdXNoKGl0ZW0pXHJcbiAgICAgICAgICB9LCB0cmVlT3B0cylcclxuICAgICAgICAgIHJvdy5fWF9FWFBBTkQgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy50cmVlVGFibGVEYXRhID0gdHJlZVRhYmxlRGF0YS5maWx0ZXIoKGl0ZW06IGFueSkgPT4gbm9kZUNoaWxkTGlzdC5pbmRleE9mKGl0ZW0pID09PSAtMSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZVRhYmxlRGF0YVxyXG4gICAgICB9LFxyXG4gICAgICAvKipcclxuICAgICAgICog5bGV5byAL+aUtui1t+aJgOacieagkeiKgueCuVxyXG4gICAgICAgKi9cclxuICAgICAgdmlydHVhbEFsbEV4cGFuZCAoZXhwYW5kZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCB7IHRyZWVPcHRzIH0gPSB0aGlzXHJcbiAgICAgICAgaWYgKGV4cGFuZGVkKSB7XHJcbiAgICAgICAgICBjb25zdCB0YWJsZUxpc3Q6IGFueVtdID0gW11cclxuICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUodGhpcy5mdWxsVHJlZURhdGEsIHJvdyA9PiB7XHJcbiAgICAgICAgICAgIHJvdy5fWF9FWFBBTkQgPSBleHBhbmRlZFxyXG4gICAgICAgICAgICB0YWJsZUxpc3QucHVzaChyb3cpXHJcbiAgICAgICAgICB9LCB0cmVlT3B0cylcclxuICAgICAgICAgIHRoaXMudHJlZVRhYmxlRGF0YSA9IHRhYmxlTGlzdFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBYRVV0aWxzLmVhY2hUcmVlKHRoaXMuZnVsbFRyZWVEYXRhLCByb3cgPT4ge1xyXG4gICAgICAgICAgICByb3cuX1hfRVhQQU5EID0gZXhwYW5kZWRcclxuICAgICAgICAgIH0sIHRyZWVPcHRzKVxyXG4gICAgICAgICAgdGhpcy50cmVlVGFibGVEYXRhID0gdGhpcy5mdWxsVHJlZURhdGEuc2xpY2UoMClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZVRhYmxlRGF0YVxyXG4gICAgICB9LFxyXG4gICAgICBjbGVhckNoZWNrYm94Um93ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRBbGxDaGVja2JveFJvdyhmYWxzZSlcclxuICAgICAgfSxcclxuICAgICAgdG9nZ2xlQWxsQ2hlY2tib3hSb3cgKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2hlY2tib3hPcHRzIH0gPSB0aGlzXHJcbiAgICAgICAgY29uc3QgeyBjaGVja0ZpZWxkLCBjaGVja1N0cmljdGx5IH0gPSBjaGVja2JveE9wdHNcclxuICAgICAgICBpZiAoY2hlY2tGaWVsZCAmJiAhY2hlY2tTdHJpY3RseSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWxsQ2hlY2tib3hSb3coIXRoaXMuZnVsbFRyZWVEYXRhLmV2ZXJ5KChyb3c6IGFueSkgPT4gcm93W2NoZWNrRmllbGRdKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJG5leHRUaWNrKClcclxuICAgICAgfSxcclxuICAgICAgc2V0QWxsQ2hlY2tib3hSb3cgKGNoZWNrZWQ/OiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgeyBjaGVja2JveE9wdHMsIHRyZWVPcHRzIH0gPSB0aGlzXHJcbiAgICAgICAgY29uc3QgeyBjaGVja0ZpZWxkLCBoYWxmRmllbGQsIGNoZWNrU3RyaWN0bHkgfSA9IGNoZWNrYm94T3B0c1xyXG4gICAgICAgIGlmIChjaGVja0ZpZWxkICYmICFjaGVja1N0cmljdGx5KSB7XHJcbiAgICAgICAgICBYRVV0aWxzLmVhY2hUcmVlKHRoaXMuZnVsbFRyZWVEYXRhLCByb3cgPT4ge1xyXG4gICAgICAgICAgICByb3dbY2hlY2tGaWVsZF0gPSBjaGVja2VkXHJcbiAgICAgICAgICAgIGlmIChoYWxmRmllbGQpIHtcclxuICAgICAgICAgICAgICByb3dbaGFsZkZpZWxkXSA9IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHRyZWVPcHRzKVxyXG4gICAgICAgICAgdGhpcy4kcmVmcy54VGFibGUuY2hlY2tTZWxlY3Rpb25TdGF0dXMoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy4kbmV4dFRpY2soKVxyXG4gICAgICB9LFxyXG4gICAgICBjaGVja2JveEFsbEV2ZW50IChwYXJhbXM6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHsgY2hlY2tlZCB9ID0gcGFyYW1zXHJcbiAgICAgICAgdGhpcy5zZXRBbGxDaGVja2JveFJvdyhjaGVja2VkKVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoZWNrYm94LWFsbCcsIHBhcmFtcylcclxuICAgICAgfSxcclxuICAgICAgY2hlY2tib3hDaGFuZ2VFdmVudCAocGFyYW1zOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB7IHJvdywgY2hlY2tlZCB9ID0gcGFyYW1zXHJcbiAgICAgICAgdGhpcy5zZXRDaGVja2JveFJvdyhyb3csIGNoZWNrZWQpXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hlY2tib3gtY2hhbmdlJywgcGFyYW1zKVxyXG4gICAgICB9LFxyXG4gICAgICB0b2dnbGVDaGVja2JveFJvdyAocm93czogYW55KSB7XHJcbiAgICAgICAgY29uc3QgeyBjaGVja2JveE9wdHMgfSA9IHRoaXNcclxuICAgICAgICBjb25zdCB7IGNoZWNrRmllbGQgfSA9IGNoZWNrYm94T3B0c1xyXG4gICAgICAgIGlmIChjaGVja0ZpZWxkKSB7XHJcbiAgICAgICAgICByb3dzLmZvckVhY2goKHJvdzogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q2hlY2tib3hSb3cocm93LCAhcm93W2NoZWNrRmllbGRdKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldENoZWNrYm94Um93IChyb3dzOiBhbnksIGNoZWNrZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCB7IGNoZWNrYm94T3B0cywgdHJlZU9wdHMgfSA9IHRoaXNcclxuICAgICAgICBjb25zdCB7IGNoZWNrRmllbGQsIGhhbGZGaWVsZCwgY2hlY2tTdHJpY3RseSB9ID0gY2hlY2tib3hPcHRzXHJcbiAgICAgICAgaWYgKCFYRVV0aWxzLmlzQXJyYXkocm93cykpIHtcclxuICAgICAgICAgIHJvd3MgPSBbcm93c11cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNoZWNrRmllbGQpIHtcclxuICAgICAgICAgIGlmIChjaGVja1N0cmljdGx5KSB7XHJcbiAgICAgICAgICAgIHJvd3MuZm9yRWFjaCgocm93OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICByb3dbY2hlY2tGaWVsZF0gPSBjaGVja2VkXHJcbiAgICAgICAgICAgICAgaWYgKGhhbGZGaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgcm93W2hhbGZGaWVsZF0gPSBmYWxzZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUocm93cywgcm93ID0+IHtcclxuICAgICAgICAgICAgICByb3dbY2hlY2tGaWVsZF0gPSBjaGVja2VkXHJcbiAgICAgICAgICAgICAgaWYgKGhhbGZGaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgcm93W2hhbGZGaWVsZF0gPSBmYWxzZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdHJlZU9wdHMpXHJcbiAgICAgICAgICAgIHJvd3MuZm9yRWFjaCgocm93OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmNoZWNrUGFyZW50Tm9kZVNlbGVjdGlvbihyb3cpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLiRuZXh0VGljaygpXHJcbiAgICAgIH0sXHJcbiAgICAgIGNoZWNrUGFyZW50Tm9kZVNlbGVjdGlvbiAocm93OiBhbnkpIHtcclxuICAgICAgICBjb25zdCB7IGNoZWNrYm94T3B0cywgdHJlZU9wdHMgfSA9IHRoaXNcclxuICAgICAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0cmVlT3B0c1xyXG4gICAgICAgIGNvbnN0IHsgY2hlY2tGaWVsZCwgaGFsZkZpZWxkLCBjaGVja1N0cmljdGx5IH0gPSBjaGVja2JveE9wdHNcclxuICAgICAgICBjb25zdCBtYXRjaE9iaiA9IFhFVXRpbHMuZmluZFRyZWUodGhpcy5mdWxsVHJlZURhdGEgYXMgYW55W10sIGl0ZW0gPT4gaXRlbSA9PT0gcm93LCB0cmVlT3B0cylcclxuICAgICAgICBpZiAobWF0Y2hPYmogJiYgY2hlY2tGaWVsZCAmJiAhY2hlY2tTdHJpY3RseSkge1xyXG4gICAgICAgICAgY29uc3QgcGFyZW50Um93ID0gbWF0Y2hPYmoucGFyZW50XHJcbiAgICAgICAgICBpZiAocGFyZW50Um93KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzQWxsID0gcGFyZW50Um93W2NoaWxkcmVuXS5ldmVyeSgoaXRlbTogYW55KSA9PiBpdGVtW2NoZWNrRmllbGRdKVxyXG4gICAgICAgICAgICBpZiAoaGFsZkZpZWxkICYmICFpc0FsbCkge1xyXG4gICAgICAgICAgICAgIHBhcmVudFJvd1toYWxmRmllbGRdID0gcGFyZW50Um93W2NoaWxkcmVuXS5zb21lKChpdGVtOiBhbnkpID0+IGl0ZW1bY2hlY2tGaWVsZF0gfHwgaXRlbVtoYWxmRmllbGRdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudFJvd1tjaGVja0ZpZWxkXSA9IGlzQWxsXHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYXJlbnROb2RlU2VsZWN0aW9uKHBhcmVudFJvdylcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuJHJlZnMueFRhYmxlLmNoZWNrU2VsZWN0aW9uU3RhdHVzKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldENoZWNrYm94UmVjb3JkcyAoKSB7XHJcbiAgICAgICAgY29uc3QgeyBjaGVja2JveE9wdHMsIHRyZWVPcHRzIH0gPSB0aGlzXHJcbiAgICAgICAgY29uc3QgeyBjaGVja0ZpZWxkIH0gPSBjaGVja2JveE9wdHNcclxuICAgICAgICBpZiAoY2hlY2tGaWVsZCkge1xyXG4gICAgICAgICAgY29uc3QgcmVjb3JkczogYW55W10gPSBbXVxyXG4gICAgICAgICAgWEVVdGlscy5lYWNoVHJlZSh0aGlzLmZ1bGxUcmVlRGF0YSwgcm93ID0+IHtcclxuICAgICAgICAgICAgaWYgKHJvd1tjaGVja0ZpZWxkXSkge1xyXG4gICAgICAgICAgICAgIHJlY29yZHMucHVzaChyb3cpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHRyZWVPcHRzKVxyXG4gICAgICAgICAgcmV0dXJuIHJlY29yZHNcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMueFRhYmxlLmdldENoZWNrYm94UmVjb3JkcygpXHJcbiAgICAgIH0sXHJcbiAgICAgIGdldENoZWNrYm94SW5kZXRlcm1pbmF0ZVJlY29yZHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2hlY2tib3hPcHRzLCB0cmVlT3B0cyB9ID0gdGhpc1xyXG4gICAgICAgIGNvbnN0IHsgaGFsZkZpZWxkIH0gPSBjaGVja2JveE9wdHNcclxuICAgICAgICBpZiAoaGFsZkZpZWxkKSB7XHJcbiAgICAgICAgICBjb25zdCByZWNvcmRzOiBhbnlbXSA9IFtdXHJcbiAgICAgICAgICBYRVV0aWxzLmVhY2hUcmVlKHRoaXMuZnVsbFRyZWVEYXRhLCByb3cgPT4ge1xyXG4gICAgICAgICAgICBpZiAocm93W2hhbGZGaWVsZF0pIHtcclxuICAgICAgICAgICAgICByZWNvcmRzLnB1c2gocm93KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCB0cmVlT3B0cylcclxuICAgICAgICAgIHJldHVybiByZWNvcmRzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLiRyZWZzLnhUYWJsZS5nZXRDaGVja2JveEluZGV0ZXJtaW5hdGVSZWNvcmRzKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdnhldGFibGUuVnVlLmNvbXBvbmVudChvcHRpb25zLm5hbWUsIG9wdGlvbnMpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOWinuW8uuaPkuS7tu+8jOWunueOsOeugOWNleeahOiZmuaLn+agkeihqOagvFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luVmlydHVhbFRyZWUgPSB7XHJcbiAgaW5zdGFsbCAodnhldGFibGU6IHR5cGVvZiBWWEVUYWJsZSkge1xyXG4gICAgcmVnaXN0ZXJDb21wb25lbnQodnhldGFibGUpXHJcbiAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlICYmIHdpbmRvdy5WWEVUYWJsZS51c2UpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luVmlydHVhbFRyZWUpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZYRVRhYmxlUGx1Z2luVmlydHVhbFRyZWVcclxuIiwiaW1wb3J0IFhFVXRpbHMgZnJvbSAneGUtdXRpbHMnO1xuaW1wb3J0IHsgVGFibGUsIEdyaWQgfSBmcm9tICd2eGUtdGFibGUnO1xuZnVuY3Rpb24gaGFzQ2hpbGRzKF92bSwgcm93KSB7XG4gICAgY29uc3QgY2hpbGRMaXN0ID0gcm93W192bS50cmVlT3B0cy5jaGlsZHJlbl07XG4gICAgcmV0dXJuIGNoaWxkTGlzdCAmJiBjaGlsZExpc3QubGVuZ3RoO1xufVxuZnVuY3Rpb24gcmVuZGVyRGVmYXVsdEZvcm0oaCwgX3ZtKSB7XG4gICAgY29uc3QgeyBwcm94eUNvbmZpZywgcHJveHlPcHRzLCBmb3JtRGF0YSwgZm9ybUNvbmZpZywgZm9ybU9wdHMgfSA9IF92bTtcbiAgICBpZiAoZm9ybUNvbmZpZyAmJiBmb3JtT3B0cy5pdGVtcyAmJiBmb3JtT3B0cy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFmb3JtT3B0cy5pbml0ZWQpIHtcbiAgICAgICAgICAgIGZvcm1PcHRzLmluaXRlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBiZWZvcmVJdGVtID0gcHJveHlPcHRzLmJlZm9yZUl0ZW07XG4gICAgICAgICAgICBpZiAocHJveHlPcHRzICYmIGJlZm9yZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICBmb3JtT3B0cy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZUl0ZW0uY2FsbChfdm0sIHsgJGdyaWQ6IF92bSwgaXRlbSB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgaCgndnhlLWZvcm0nLCB7XG4gICAgICAgICAgICAgICAgcHJvcHM6IE9iamVjdC5hc3NpZ24oe30sIGZvcm1PcHRzLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHByb3h5Q29uZmlnICYmIHByb3h5T3B0cy5mb3JtID8gZm9ybURhdGEgOiBmb3JtT3B0cy5kYXRhXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0OiBfdm0uc3VibWl0RXZlbnQsXG4gICAgICAgICAgICAgICAgICAgIHJlc2V0OiBfdm0ucmVzZXRFdmVudCxcbiAgICAgICAgICAgICAgICAgICAgJ3N1Ym1pdC1pbnZhbGlkJzogX3ZtLnN1Ym1pdEludmFsaWRFdmVudCxcbiAgICAgICAgICAgICAgICAgICAgJ3RvZ2dsZS1jb2xsYXBzZSc6IF92bS50b2dnbENvbGxhcHNlRXZlbnRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlZjogJ2Zvcm0nXG4gICAgICAgICAgICB9KVxuICAgICAgICBdO1xuICAgIH1cbiAgICByZXR1cm4gW107XG59XG5mdW5jdGlvbiBnZXRUb29sYmFyU2xvdHMoX3ZtKSB7XG4gICAgY29uc3QgeyAkc2NvcGVkU2xvdHMsIHRvb2xiYXJPcHRzIH0gPSBfdm07XG4gICAgY29uc3QgdG9vbGJhck9wdFNsb3RzID0gdG9vbGJhck9wdHMuc2xvdHM7XG4gICAgbGV0ICRidXR0b25zO1xuICAgIGxldCAkdG9vbHM7XG4gICAgY29uc3Qgc2xvdHMgPSB7fTtcbiAgICBpZiAodG9vbGJhck9wdFNsb3RzKSB7XG4gICAgICAgICRidXR0b25zID0gdG9vbGJhck9wdFNsb3RzLmJ1dHRvbnM7XG4gICAgICAgICR0b29scyA9IHRvb2xiYXJPcHRTbG90cy50b29scztcbiAgICAgICAgaWYgKCRidXR0b25zICYmICRzY29wZWRTbG90c1skYnV0dG9uc10pIHtcbiAgICAgICAgICAgICRidXR0b25zID0gJHNjb3BlZFNsb3RzWyRidXR0b25zXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJHRvb2xzICYmICRzY29wZWRTbG90c1skdG9vbHNdKSB7XG4gICAgICAgICAgICAkdG9vbHMgPSAkc2NvcGVkU2xvdHNbJHRvb2xzXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoJGJ1dHRvbnMpIHtcbiAgICAgICAgc2xvdHMuYnV0dG9ucyA9ICRidXR0b25zO1xuICAgIH1cbiAgICBpZiAoJHRvb2xzKSB7XG4gICAgICAgIHNsb3RzLnRvb2xzID0gJHRvb2xzO1xuICAgIH1cbiAgICByZXR1cm4gc2xvdHM7XG59XG5mdW5jdGlvbiBnZXRQYWdlclNsb3RzKF92bSkge1xuICAgIGNvbnN0IHsgJHNjb3BlZFNsb3RzLCBwYWdlck9wdHMgfSA9IF92bTtcbiAgICBjb25zdCBwYWdlck9wdFNsb3RzID0gcGFnZXJPcHRzLnNsb3RzO1xuICAgIGNvbnN0IHNsb3RzID0ge307XG4gICAgbGV0ICRsZWZ0O1xuICAgIGxldCAkcmlnaHQ7XG4gICAgaWYgKHBhZ2VyT3B0U2xvdHMpIHtcbiAgICAgICAgJGxlZnQgPSBwYWdlck9wdFNsb3RzLmxlZnQ7XG4gICAgICAgICRyaWdodCA9IHBhZ2VyT3B0U2xvdHMucmlnaHQ7XG4gICAgICAgIGlmICgkbGVmdCAmJiAkc2NvcGVkU2xvdHNbJGxlZnRdKSB7XG4gICAgICAgICAgICAkbGVmdCA9ICRzY29wZWRTbG90c1skbGVmdF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRyaWdodCAmJiAkc2NvcGVkU2xvdHNbJHJpZ2h0XSkge1xuICAgICAgICAgICAgJHJpZ2h0ID0gJHNjb3BlZFNsb3RzWyRyaWdodF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCRsZWZ0KSB7XG4gICAgICAgIHNsb3RzLmxlZnQgPSAkbGVmdDtcbiAgICB9XG4gICAgaWYgKCRyaWdodCkge1xuICAgICAgICBzbG90cy5yaWdodCA9ICRyaWdodDtcbiAgICB9XG4gICAgcmV0dXJuIHNsb3RzO1xufVxuZnVuY3Rpb24gZ2V0VGFibGVPbnMoX3ZtKSB7XG4gICAgY29uc3QgeyAkbGlzdGVuZXJzLCBwcm94eUNvbmZpZywgcHJveHlPcHRzIH0gPSBfdm07XG4gICAgY29uc3Qgb25zID0ge307XG4gICAgWEVVdGlscy5lYWNoKCRsaXN0ZW5lcnMsIChjYiwgdHlwZSkgPT4ge1xuICAgICAgICBvbnNbdHlwZV0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgX3ZtLiRlbWl0KHR5cGUsIC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIG9uc1snY2hlY2tib3gtYWxsJ10gPSBfdm0uY2hlY2tib3hBbGxFdmVudDtcbiAgICBvbnNbJ2NoZWNrYm94LWNoYW5nZSddID0gX3ZtLmNoZWNrYm94Q2hhbmdlRXZlbnQ7XG4gICAgaWYgKHByb3h5Q29uZmlnKSB7XG4gICAgICAgIGlmIChwcm94eU9wdHMuc29ydCkge1xuICAgICAgICAgICAgb25zWydzb3J0LWNoYW5nZSddID0gX3ZtLnNvcnRDaGFuZ2VFdmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJveHlPcHRzLmZpbHRlcikge1xuICAgICAgICAgICAgb25zWydmaWx0ZXItY2hhbmdlJ10gPSBfdm0uZmlsdGVyQ2hhbmdlRXZlbnQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9ucztcbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50KHZ4ZXRhYmxlKSB7XG4gICAgY29uc3QgeyBzZXR1cCwgdCB9ID0gdnhldGFibGU7XG4gICAgY29uc3QgR2xvYmFsQ29uZmlnID0gc2V0dXAoe30pO1xuICAgIGNvbnN0IHByb3BLZXlzID0gT2JqZWN0LmtleXMoVGFibGUucHJvcHMpLmZpbHRlcihuYW1lID0+IFsnZGF0YScsICd0cmVlQ29uZmlnJ10uaW5kZXhPZihuYW1lKSA9PT0gLTEpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIG5hbWU6ICdWeGVWaXJ0dWFsVHJlZScsXG4gICAgICAgIGV4dGVuZHM6IEdyaWQsXG4gICAgICAgIGRhdGEoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlbW92ZUxpc3Q6IFtdLFxuICAgICAgICAgICAgICAgIHRyZWVMYXp5TG9hZGVkczogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXB1dGVkOiB7XG4gICAgICAgICAgICB0cmVlT3B0cygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgR2xvYmFsQ29uZmlnLnRhYmxlLnRyZWVDb25maWcsIHRoaXMudHJlZUNvbmZpZyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hlY2tib3hPcHRzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBHbG9iYWxDb25maWcudGFibGUuY2hlY2tib3hDb25maWcsIHRoaXMuY2hlY2tib3hDb25maWcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYmxlRXh0ZW5kUHJvcHMoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdCA9IHt9O1xuICAgICAgICAgICAgICAgIHByb3BLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdFtrZXldID0gdGhpc1trZXldO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXN0LmNoZWNrYm94Q29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3QuY2hlY2tib3hDb25maWcgPSB0aGlzLmNoZWNrYm94T3B0cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICBjb2x1bW5zKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2x1bW5zKHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgICAgICBjb25zdCB7ICR2eGUsIHRyZWVPcHRzLCBkYXRhLCBjb2x1bW5zIH0gPSB0aGlzO1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICAgICAgICAgICAgZnVsbFRyZWVEYXRhOiBbXSxcbiAgICAgICAgICAgICAgICB0cmVlVGFibGVEYXRhOiBbXSxcbiAgICAgICAgICAgICAgICBmdWxsVHJlZVJvd01hcDogbmV3IE1hcCgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmtlZXBTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCR2eGUudCgndnhlLmVycm9yLm5vdFByb3AnLCBbJ2tlZXAtc291cmNlJ10pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cmVlT3B0cy5saW5lKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigkdnhlLnQoJ3Z4ZS5lcnJvci5ub3RQcm9wJywgWydjaGVja2JveC1jb25maWcubGluZSddKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sdW1ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ29sdW1ucyhjb2x1bW5zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWxvYWREYXRhKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZW5kZXIoaCkge1xuICAgICAgICAgICAgY29uc3QgeyB2U2l6ZSwgaXNaTWF4IH0gPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgJHNjb3BlZFNsb3RzID0gdGhpcy4kc2NvcGVkU2xvdHM7XG4gICAgICAgICAgICBjb25zdCBoYXNGb3JtID0gISEoJHNjb3BlZFNsb3RzLmZvcm0gfHwgdGhpcy5mb3JtQ29uZmlnKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc1Rvb2xiYXIgPSAhISgkc2NvcGVkU2xvdHMudG9vbGJhciB8fCB0aGlzLnRvb2xiYXJDb25maWcgfHwgdGhpcy50b29sYmFyKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc1BhZ2VyID0gISEoJHNjb3BlZFNsb3RzLnBhZ2VyIHx8IHRoaXMucGFnZXJDb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBjbGFzczogWyd2eGUtZ3JpZCcsICd2eGUtdmlydHVhbC10cmVlJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgW2BzaXplLS0ke3ZTaXplfWBdOiB2U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0LS1hbmltYXQnOiAhIXRoaXMuYW5pbWF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lzLS1yb3VuZCc6IHRoaXMucm91bmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaXMtLW1heGltaXplJzogaXNaTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lzLS1sb2FkaW5nJzogdGhpcy5sb2FkaW5nIHx8IHRoaXMudGFibGVMb2FkaW5nXG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB0aGlzLnJlbmRlclN0eWxlXG4gICAgICAgICAgICB9LCBbXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog5riy5p+T6KGo5Y2VXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaGFzRm9ybVxuICAgICAgICAgICAgICAgICAgICA/IGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZjogJ2Zvcm1XcmFwcGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiAndnhlLWdyaWQtLWZvcm0td3JhcHBlcidcbiAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlZFNsb3RzLmZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgID8gJHNjb3BlZFNsb3RzLmZvcm0uY2FsbCh0aGlzLCB7ICRncmlkOiB0aGlzIH0sIGgpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHJlbmRlckRlZmF1bHRGb3JtKGgsIHRoaXMpKVxuICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog5riy5p+T5bel5YW35qCPXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaGFzVG9vbGJhclxuICAgICAgICAgICAgICAgICAgICA/IGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZjogJ3Rvb2xiYXJXcmFwcGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAndnhlLWdyaWQtLXRvb2xiYXItd3JhcHBlcidcbiAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlZFNsb3RzLnRvb2xiYXJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJHNjb3BlZFNsb3RzLnRvb2xiYXIuY2FsbCh0aGlzLCB7ICRncmlkOiB0aGlzIH0sIGgpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCd2eGUtdG9vbGJhcicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHRoaXMudG9vbGJhck9wdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZjogJ3hUb29sYmFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVkU2xvdHM6IGdldFRvb2xiYXJTbG90cyh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog5riy5p+T6KGo5qC86aG26YOo5Yy65Z+fXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJHNjb3BlZFNsb3RzLnRvcFxuICAgICAgICAgICAgICAgICAgICA/IGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZjogJ3RvcFdyYXBwZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGljQ2xhc3M6ICd2eGUtZ3JpZC0tdG9wLXdyYXBwZXInXG4gICAgICAgICAgICAgICAgICAgIH0sICRzY29wZWRTbG90cy50b3AuY2FsbCh0aGlzLCB7ICRncmlkOiB0aGlzIH0sIGgpKVxuICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog5riy5p+T6KGo5qC8XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaCgndnhlLXRhYmxlJywge1xuICAgICAgICAgICAgICAgICAgICBwcm9wczogdGhpcy50YWJsZVByb3BzLFxuICAgICAgICAgICAgICAgICAgICBvbjogZ2V0VGFibGVPbnModGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlZFNsb3RzOiAkc2NvcGVkU2xvdHMsXG4gICAgICAgICAgICAgICAgICAgIHJlZjogJ3hUYWJsZSdcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDmuLLmn5PooajmoLzlupXpg6jljLrln59cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAkc2NvcGVkU2xvdHMuYm90dG9tXG4gICAgICAgICAgICAgICAgICAgID8gaCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmOiAnYm90dG9tV3JhcHBlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogJ3Z4ZS1ncmlkLS1ib3R0b20td3JhcHBlcidcbiAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlZFNsb3RzLmJvdHRvbS5jYWxsKHRoaXMsIHsgJGdyaWQ6IHRoaXMgfSwgaCkpXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDmuLLmn5PliIbpobVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBoYXNQYWdlclxuICAgICAgICAgICAgICAgICAgICA/IGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZjogJ3BhZ2VyV3JhcHBlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogJ3Z4ZS1ncmlkLS1wYWdlci13cmFwcGVyJ1xuICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGVkU2xvdHMucGFnZXJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJHNjb3BlZFNsb3RzLnBhZ2VyLmNhbGwodGhpcywgeyAkZ3JpZDogdGhpcyB9LCBoKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgndnhlLXBhZ2VyJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczogdGhpcy5wYWdlclByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BhZ2UtY2hhbmdlJzogdGhpcy5wYWdlQ2hhbmdlRXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVkU2xvdHM6IGdldFBhZ2VyU2xvdHModGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgbG9hZENvbHVtbihjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJG5leHRUaWNrKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgJHZ4ZSwgJHNjb3BlZFNsb3RzLCByZW5kZXJUcmVlSWNvbiwgdHJlZU9wdHMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUoY29sdW1ucywgY29sdW1uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4udHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbHVtbi5zbG90cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uc2xvdHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uLnNsb3RzLmljb24gPSByZW5kZXJUcmVlSWNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4uc2xvdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBYRVV0aWxzLmVhY2goY29sdW1uLnNsb3RzLCAoZnVuYywgbmFtZSwgY29sU2xvdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5YW85a65IHYyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghWEVVdGlscy5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlZFNsb3RzW2Z1bmNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sU2xvdHNbbmFtZV0gPSAkc2NvcGVkU2xvdHNbZnVuY107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xTbG90c1tuYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigkdnhlLnQoJ3Z4ZS5lcnJvci5ub3RTbG90JywgW2Z1bmNdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgdHJlZU9wdHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLnhUYWJsZS5sb2FkQ29sdW1uKGNvbHVtbnMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbmRlclRyZWVJY29uKHBhcmFtcywgaCwgY2VsbFZOb2Rlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdHJlZUxhenlMb2FkZWRzLCB0cmVlT3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlzSGlkZGVuLCByb3cgfSA9IHBhcmFtcztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoaWxkcmVuLCBoYXNDaGlsZCwgaW5kZW50LCBsYXp5LCB0cmlnZ2VyLCBpY29uTG9hZGVkLCBzaG93SWNvbiwgaWNvbk9wZW4sIGljb25DbG9zZSB9ID0gdHJlZU9wdHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93Q2hpbGRzID0gcm93W2NoaWxkcmVuXTtcbiAgICAgICAgICAgICAgICBsZXQgaGFzTGF6eUNoaWxkcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCBpc0FjZWl2ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgaXNMYXp5TG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3Qgb24gPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzSGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQWNlaXZlZCA9IHJvdy5fWF9FWFBBTkQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXp5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xhenlMb2FkZWQgPSB0cmVlTGF6eUxvYWRlZHMuaW5kZXhPZihyb3cpID4gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNMYXp5Q2hpbGRzID0gcm93W2hhc0NoaWxkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRyaWdnZXIgfHwgdHJpZ2dlciA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uLmNsaWNrID0gKGV2bnQpID0+IHRoaXMudHJpZ2dlclRyZWVFeHBhbmRFdmVudChldm50LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogWyd2eGUtY2VsbC0tdHJlZS1ub2RlJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXMtLWFjdGl2ZSc6IGlzQWNlaXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nTGVmdDogYCR7cm93Ll9YX0xFVkVMICogaW5kZW50fXB4YFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93SWNvbiAmJiAoKHJvd0NoaWxkcyAmJiByb3dDaGlsZHMubGVuZ3RoKSB8fCBoYXNMYXp5Q2hpbGRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Z4ZS10cmVlLS1idG4td3JhcHBlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdpJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBbJ3Z4ZS10cmVlLS1ub2RlLWJ0bicsIGlzTGF6eUxvYWRlZCA/IChpY29uTG9hZGVkIHx8IEdsb2JhbENvbmZpZy5pY29uLlRBQkxFX1RSRUVfTE9BREVEKSA6IChpc0FjZWl2ZWQgPyAoaWNvbk9wZW4gfHwgR2xvYmFsQ29uZmlnLmljb24uVEFCTEVfVFJFRV9PUEVOKSA6IChpY29uQ2xvc2UgfHwgR2xvYmFsQ29uZmlnLmljb24uVEFCTEVfVFJFRV9DTE9TRSkpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAndnhlLXRyZWUtY2VsbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGNlbGxWTm9kZXMpXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfbG9hZFRyZWVEYXRhKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGhpZ2hsaWdodEN1cnJlbnRSb3cgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0Um93ID0gdGhpcy5nZXRSYWRpb1JlY29yZCgpO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50Um93O1xuICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHRDdXJyZW50Um93KSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cgPSB0aGlzLmdldEN1cnJlbnRSZWNvcmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJG5leHRUaWNrKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy4kcmVmcy54VGFibGUubG9hZERhdGEoZGF0YSkpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdFJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRSYWRpb1JvdyhzZWxlY3RSb3cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHRDdXJyZW50Um93ICYmIGN1cnJlbnRSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudFJvdyhjdXJyZW50Um93KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldERhdGEocm93SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGZ1bGxUcmVlRGF0YSB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICByZXR1cm4gWEVVdGlscy5pc1VuZGVmaW5lZChyb3dJbmRleCkgPyBmdWxsVHJlZURhdGEuc2xpY2UoMCkgOiBmdWxsVHJlZURhdGFbcm93SW5kZXhdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFRyZWVEYXRhKHRoaXMudG9WaXJ0dWFsVHJlZShkYXRhKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVsb2FkRGF0YShkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJG5leHRUaWNrKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy4kcmVmcy54VGFibGUucmVsb2FkRGF0YSh0aGlzLnRvVmlydHVhbFRyZWUoZGF0YSkpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmhhbmRsZURlZmF1bHRUcmVlRXhwYW5kKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzVHJlZUV4cGFuZEJ5Um93KHJvdykge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXJvdy5fWF9FWFBBTkQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0VHJlZUV4cGFuc2lvbihyb3dzLCBleHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFRyZWVFeHBhbmQocm93cywgZXhwYW5kZWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhbmRsZUFzeW5jVHJlZUV4cGFuZENoaWxkcyhyb3cpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRyZWVMYXp5TG9hZGVkcywgdHJlZU9wdHMsIGNoZWNrYm94T3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGxvYWRNZXRob2QsIGNoaWxkcmVuIH0gPSB0cmVlT3B0cztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoZWNrU3RyaWN0bHkgfSA9IGNoZWNrYm94T3B0cztcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmVlTGF6eUxvYWRlZHMucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZE1ldGhvZCh7IHJvdyB9KS5jYXRjaCgoKSA9PiBbXSkudGhlbigoY2hpbGRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Ll9YX0xPQURFRCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWEVVdGlscy5yZW1vdmUodHJlZUxhenlMb2FkZWRzLCBpdGVtID0+IGl0ZW0gPT09IHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFYRVV0aWxzLmlzQXJyYXkoY2hpbGRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbY2hpbGRyZW5dID0gY2hpbGRzLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uX1hfTE9BREVEID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLl9YX0VYUEFORCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5fWF9JTlNFUlQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uX1hfTEVWRUwgPSByb3cuX1hfTEVWRUwgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRzLmxlbmd0aCAmJiAhcm93Ll9YX0VYUEFORCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXJ0dWFsRXhwYW5kKHJvdywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5b2T5YmN6IqC54K55bey6YCJ5Lit77yM5YiZ5bGV5byA5ZCO5a2Q6IqC54K55Lmf6KKr6YCJ5LitXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdHJpY3RseSAmJiB0aGlzLmlzQ2hlY2tlZEJ5Q2hlY2tib3hSb3cocm93KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRDaGVja2JveFJvdyhjaGlsZHMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy4kbmV4dFRpY2soKS50aGVuKCgpID0+IHRoaXMucmVjYWxjdWxhdGUoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0VHJlZUV4cGFuZChyb3dzLCBleHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdHJlZUxhenlMb2FkZWRzLCB0cmVlT3B0cywgdGFibGVGdWxsRGF0YSwgdHJlZU5vZGVDb2x1bW4gfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsYXp5LCBoYXNDaGlsZCwgYWNjb3JkaW9uLCB0b2dnbGVNZXRob2QgfSA9IHRyZWVPcHRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChyb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghWEVVdGlscy5pc0FycmF5KHJvd3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gW3Jvd3NdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleCh0cmVlTm9kZUNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRjb2x1bW5JbmRleCA9IHRoaXMuZ2V0Vk1Db2x1bW5JbmRleCh0cmVlTm9kZUNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWxpZFJvd3MgPSB0b2dnbGVNZXRob2QgPyByb3dzLmZpbHRlcigocm93KSA9PiB0b2dnbGVNZXRob2QoeyBleHBhbmRlZCwgY29sdW1uOiB0cmVlTm9kZUNvbHVtbiwgcm93LCBjb2x1bW5JbmRleCwgJGNvbHVtbkluZGV4IH0pKSA6IHJvd3M7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY2NvcmRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkUm93cyA9IHZhbGlkUm93cy5sZW5ndGggPyBbdmFsaWRSb3dzW3ZhbGlkUm93cy5sZW5ndGggLSAxXV0gOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWQjOS4gOe6p+WPquiDveWxleW8gOS4gOS4qlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hPYmogPSBYRVV0aWxzLmZpbmRUcmVlKHRhYmxlRnVsbERhdGEsIGl0ZW0gPT4gaXRlbSA9PT0gcm93c1swXSwgdHJlZU9wdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hPYmouaXRlbXMuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5fWF9FWFBBTkQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YWxpZFJvd3MuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xvYWQgPSBsYXp5ICYmIHJvd1toYXNDaGlsZF0gJiYgIXJvdy5fWF9MT0FERUQgJiYgdHJlZUxhenlMb2FkZWRzLmluZGV4T2Yocm93KSA9PT0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmmK/lkKbkvb/nlKjmh5LliqDovb1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHBhbmRlZCAmJiBpc0xvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmhhbmRsZUFzeW5jVHJlZUV4cGFuZENoaWxkcyhyb3cpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNDaGlsZHModGhpcywgcm93KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpcnR1YWxFeHBhbmQocm93LCAhIWV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRUcmVlRGF0YSh0aGlzLnRyZWVUYWJsZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVjYWxjdWxhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRuZXh0VGljaygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldEFsbFRyZWVFeHBhbnNpb24oZXhwYW5kZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRBbGxUcmVlRXhwYW5kKGV4cGFuZGVkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRBbGxUcmVlRXhwYW5kKGV4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRUcmVlRGF0YSh0aGlzLnZpcnR1YWxBbGxFeHBhbmQoZXhwYW5kZWQpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2dnbGVUcmVlRXhwYW5zaW9uKHJvdykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZVRyZWVFeHBhbmQocm93KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmlnZ2VyVHJlZUV4cGFuZEV2ZW50KGV2bnQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdHJlZU9wdHMsIHRyZWVMYXp5TG9hZGVkcyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsYXp5IH0gPSB0cmVlT3B0cztcbiAgICAgICAgICAgICAgICBpZiAoIWxhenkgfHwgdHJlZUxhenlMb2FkZWRzLmluZGV4T2Yocm93KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSAhdGhpcy5pc1RyZWVFeHBhbmRCeVJvdyhyb3cpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRyZWVFeHBhbmQocm93LCBleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3RvZ2dsZS10cmVlLWV4cGFuZCcsIHsgZXhwYW5kZWQsIGNvbHVtbiwgcm93LCAkZXZlbnQ6IGV2bnQgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvZ2dsZVRyZWVFeHBhbmQocm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRUcmVlRGF0YSh0aGlzLnZpcnR1YWxFeHBhbmQocm93LCAhcm93Ll9YX0VYUEFORCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFRyZWVFeHBhbmRSZWNvcmRzKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZnVsbFRyZWVEYXRhLCB0cmVlT3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCB0cmVlRXhwYW5kUmVjb3JkcyA9IFtdO1xuICAgICAgICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUoZnVsbFRyZWVEYXRhLCByb3cgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93Ll9YX0VYUEFORCAmJiBoYXNDaGlsZHModGhpcywgcm93KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJlZUV4cGFuZFJlY29yZHMucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJlZU9wdHMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmVlRXhwYW5kUmVjb3JkcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGVhclRyZWVFeHBhbmQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWxsVHJlZUV4cGFuZChmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFuZGxlQ29sdW1ucyhjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyAkdnhlLCByZW5kZXJUcmVlSWNvbiwgY2hlY2tib3hPcHRzIH0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoIWNoZWNrYm94T3B0cy5jaGVja0ZpZWxkIHx8ICFjaGVja2JveE9wdHMuaGFsZkZpZWxkKSAmJiBjb2x1bW5zLnNvbWUoY29uZiA9PiBjb25mLnR5cGUgPT09ICdjaGVja2JveCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCR2eGUudCgndnhlLmVycm9yLnJlcVByb3AnLCBbJ3RhYmxlLmNoZWNrYm94LWNvbmZpZy5jaGVja0ZpZWxkIHwgdGFibGUuY2hlY2tib3gtY29uZmlnLmhhbGZGaWVsZCddKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJlZU5vZGVDb2x1bW4gPSBjb2x1bW5zLmZpbmQoY29uZiA9PiBjb25mLnRyZWVOb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyZWVOb2RlQ29sdW1uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzbG90cyA9IHRyZWVOb2RlQ29sdW1uLnNsb3RzIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xvdHMuaWNvbiA9IHJlbmRlclRyZWVJY29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJlZU5vZGVDb2x1bW4uc2xvdHMgPSBzbG90cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZU5vZGVDb2x1bW4gPSB0cmVlTm9kZUNvbHVtbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sdW1ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6I635Y+W6KGo5qC85pWw5o2u6ZuG77yM5YyF5ZCr5paw5aKe44CB5Yig6ZmkXG4gICAgICAgICAgICAgKiDkuI3mlK/mjIHkv67mlLlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UmVjb3Jkc2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGluc2VydFJlY29yZHM6IHRoaXMuZ2V0SW5zZXJ0UmVjb3JkcygpLFxuICAgICAgICAgICAgICAgICAgICByZW1vdmVSZWNvcmRzOiB0aGlzLmdldFJlbW92ZVJlY29yZHMoKSxcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkczogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzSW5zZXJ0QnlSb3cocm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhcm93Ll9YX0lOU0VSVDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnNlcnRSZWNvcmRzKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdHJlZU9wdHMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0UmVjb3JkcyA9IFtdO1xuICAgICAgICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUodGhpcy5mdWxsVHJlZURhdGEsIHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cuX1hfSU5TRVJUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRSZWNvcmRzLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRyZWVPcHRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zZXJ0UmVjb3JkcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnNlcnQocmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydEF0KHJlY29yZHMsIG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5pSv5oyB5Lu75oSP5bGC57qn5o+S5YWl5LiO5Yig6ZmkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGluc2VydEF0KHJlY29yZHMsIHJvdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZnVsbFRyZWVEYXRhLCB0cmVlVGFibGVEYXRhLCB0cmVlT3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoIVhFVXRpbHMuaXNBcnJheShyZWNvcmRzKSkge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmRzID0gW3JlY29yZHNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSZWNvcmRzID0gcmVjb3Jkcy5tYXAoKHJlY29yZCkgPT4gdGhpcy5kZWZpbmVGaWVsZChPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgX1hfTE9BREVEOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgX1hfRVhQQU5EOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgX1hfSU5TRVJUOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBfWF9MRVZFTDogMFxuICAgICAgICAgICAgICAgIH0sIHJlY29yZCkpKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgICAgICAgICBmdWxsVHJlZURhdGEudW5zaGlmdCguLi5uZXdSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgdHJlZVRhYmxlRGF0YS51bnNoaWZ0KC4uLm5ld1JlY29yZHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxUcmVlRGF0YS5wdXNoKC4uLm5ld1JlY29yZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJlZVRhYmxlRGF0YS5wdXNoKC4uLm5ld1JlY29yZHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hPYmogPSBYRVV0aWxzLmZpbmRUcmVlKGZ1bGxUcmVlRGF0YSwgaXRlbSA9PiBpdGVtID09PSByb3csIHRyZWVPcHRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWF0Y2hPYmogfHwgbWF0Y2hPYmouaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHQoJ3Z4ZS5lcnJvci51bmFibGVJbnNlcnQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGl0ZW1zLCBpbmRleCwgbm9kZXMgfSA9IG1hdGNoT2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0cmVlVGFibGVEYXRhLmluZGV4T2Yocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJlZVRhYmxlRGF0YS5zcGxpY2Uocm93SW5kZXgsIDAsIC4uLm5ld1JlY29yZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAwLCAuLi5uZXdSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1JlY29yZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uX1hfTEVWRUwgPSBub2Rlcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRUcmVlRGF0YSh0cmVlVGFibGVEYXRhKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogbmV3UmVjb3Jkcy5sZW5ndGggPyBuZXdSZWNvcmRzW25ld1JlY29yZHMubGVuZ3RoIC0gMV0gOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93czogbmV3UmVjb3Jkc1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6I635Y+W5bey5Yig6Zmk55qE5pWw5o2uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFJlbW92ZVJlY29yZHMoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGlzdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdmVTZWxlY3RlZHMoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2hlY2tib3hSb3coKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOWIoOmZpOmAieS4reaVsOaNrlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZW1vdmVDaGVja2JveFJvdygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmUodGhpcy5nZXRDaGVja2JveFJlY29yZHMoKSkudGhlbigocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdmUocm93cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcmVtb3ZlTGlzdCwgZnVsbFRyZWVEYXRhLCB0cmVlT3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCByZXN0ID0gW107XG4gICAgICAgICAgICAgICAgaWYgKCFyb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MgPSBmdWxsVHJlZURhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFYRVV0aWxzLmlzQXJyYXkocm93cykpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93cyA9IFtyb3dzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm93cy5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hPYmogPSBYRVV0aWxzLmZpbmRUcmVlKGZ1bGxUcmVlRGF0YSwgaXRlbSA9PiBpdGVtID09PSByb3csIHRyZWVPcHRzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGl0ZW0sIGl0ZW1zLCBpbmRleCwgcGFyZW50IH0gPSBtYXRjaE9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0luc2VydEJ5Um93KHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0V4cGFuZCA9IHRoaXMuaXNUcmVlRXhwYW5kQnlSb3cocGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHBhbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2xsYXBzaW5nKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwYW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXhwYW5kaW5nKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2xsYXBzaW5nKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlVGFibGVEYXRhLnNwbGljZSh0aGlzLnRyZWVUYWJsZURhdGEuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZFRyZWVEYXRhKHRoaXMudHJlZVRhYmxlRGF0YSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJvdzogcmVzdC5sZW5ndGggPyByZXN0W3Jlc3QubGVuZ3RoIC0gMV0gOiBudWxsLCByb3dzOiByZXN0IH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDlpITnkIbpu5jorqTlsZXlvIDmoJHoioLngrlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaGFuZGxlRGVmYXVsdFRyZWVFeHBhbmQoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0cmVlQ29uZmlnLCB0cmVlT3B0cywgdGFibGVGdWxsRGF0YSB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAodHJlZUNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGNoaWxkcmVuLCBleHBhbmRBbGwsIGV4cGFuZFJvd0tleXMgfSA9IHRyZWVPcHRzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwYW5kQWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFsbFRyZWVFeHBhbmQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZXhwYW5kUm93S2V5cyAmJiB0aGlzLnJvd0lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3drZXkgPSB0aGlzLnJvd0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kUm93S2V5cy5mb3JFYWNoKChyb3dpZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoT2JqID0gWEVVdGlscy5maW5kVHJlZSh0YWJsZUZ1bGxEYXRhLCBpdGVtID0+IHJvd2lkID09PSBYRVV0aWxzLmdldChpdGVtLCByb3drZXkpLCB0cmVlT3B0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93Q2hpbGRyZW4gPSBtYXRjaE9iaiA/IG1hdGNoT2JqLml0ZW1bY2hpbGRyZW5dIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93Q2hpbGRyZW4gJiYgcm93Q2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VHJlZUV4cGFuZChtYXRjaE9iai5pdGVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOWumuS5ieagkeWxnuaAp1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0b1ZpcnR1YWxUcmVlKHRyZWVEYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0cmVlT3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCBmdWxsVHJlZVJvd01hcCA9IHRoaXMuZnVsbFRyZWVSb3dNYXA7XG4gICAgICAgICAgICAgICAgZnVsbFRyZWVSb3dNYXAuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBYRVV0aWxzLmVhY2hUcmVlKHRyZWVEYXRhLCAoaXRlbSwgaW5kZXgsIGl0ZW1zLCBwYXRocywgcGFyZW50LCBub2RlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLl9YX0xPQURFRCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLl9YX0VYUEFORCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLl9YX0lOU0VSVCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLl9YX0xFVkVMID0gbm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgZnVsbFRyZWVSb3dNYXAuc2V0KGl0ZW0sIHsgaXRlbSwgaW5kZXgsIGl0ZW1zLCBwYXRocywgcGFyZW50LCBub2RlcyB9KTtcbiAgICAgICAgICAgICAgICB9LCB0cmVlT3B0cyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mdWxsVHJlZURhdGEgPSB0cmVlRGF0YS5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVUYWJsZURhdGEgPSB0cmVlRGF0YS5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJlZURhdGE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDlsZXlvIAv5pS26LW35qCR6IqC54K5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZpcnR1YWxFeHBhbmQocm93LCBleHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdHJlZU9wdHMsIHRyZWVOb2RlQ29sdW1uIH0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdG9nZ2xlTWV0aG9kIH0gPSB0cmVlT3B0cztcbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgodHJlZU5vZGVDb2x1bW4pO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRjb2x1bW5JbmRleCA9IHRoaXMuZ2V0Vk1Db2x1bW5JbmRleCh0cmVlTm9kZUNvbHVtbik7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2dnbGVNZXRob2QgfHwgdG9nZ2xlTWV0aG9kKHsgZXhwYW5kZWQsIHJvdywgY29sdW1uOiB0cmVlTm9kZUNvbHVtbiwgY29sdW1uSW5kZXgsICRjb2x1bW5JbmRleCB9KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93Ll9YX0VYUEFORCAhPT0gZXhwYW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cuX1hfRVhQQU5EKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2xsYXBzaW5nKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUV4cGFuZGluZyhyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRyZWVUYWJsZURhdGE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8g5bGV5byA6IqC54K5XG4gICAgICAgICAgICBoYW5kbGVFeHBhbmRpbmcocm93KSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0NoaWxkcyh0aGlzLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdHJlZVRhYmxlRGF0YSwgdHJlZU9wdHMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkUm93cyA9IHJvd1t0cmVlT3B0cy5jaGlsZHJlbl07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuZExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0cmVlVGFibGVEYXRhLmluZGV4T2Yocm93KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0luZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBhbmRpbmcgZXJyb3InKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRNYXBzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgICAgICBYRVV0aWxzLmVhY2hUcmVlKGNoaWxkUm93cywgKGl0ZW0sIGluZGV4LCBvYmosIHBhdGhzLCBwYXJlbnQsIG5vZGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudCB8fCAocGFyZW50Ll9YX0VYUEFORCAmJiBleHBhbmRNYXBzLmhhcyhwYXJlbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZE1hcHMuc2V0KGl0ZW0sIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZExpc3QucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgdHJlZU9wdHMpO1xuICAgICAgICAgICAgICAgICAgICByb3cuX1hfRVhQQU5EID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdHJlZVRhYmxlRGF0YS5zcGxpY2Uocm93SW5kZXggKyAxLCAwLCAuLi5leHBhbmRMaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJlZVRhYmxlRGF0YTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyDmlLbotbfoioLngrlcbiAgICAgICAgICAgIGhhbmRsZUNvbGxhcHNpbmcocm93KSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0NoaWxkcyh0aGlzLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdHJlZVRhYmxlRGF0YSwgdHJlZU9wdHMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkUm93cyA9IHJvd1t0cmVlT3B0cy5jaGlsZHJlbl07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVDaGlsZExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgWEVVdGlscy5lYWNoVHJlZShjaGlsZFJvd3MsIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUNoaWxkTGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9LCB0cmVlT3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5fWF9FWFBBTkQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlVGFibGVEYXRhID0gdHJlZVRhYmxlRGF0YS5maWx0ZXIoKGl0ZW0pID0+IG5vZGVDaGlsZExpc3QuaW5kZXhPZihpdGVtKSA9PT0gLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmVlVGFibGVEYXRhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5bGV5byAL+aUtui1t+aJgOacieagkeiKgueCuVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2aXJ0dWFsQWxsRXhwYW5kKGV4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0cmVlT3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoZXhwYW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFibGVMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUodGhpcy5mdWxsVHJlZURhdGEsIHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cuX1hfRVhQQU5EID0gZXhwYW5kZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZUxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0cmVlT3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZVRhYmxlRGF0YSA9IHRhYmxlTGlzdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFhFVXRpbHMuZWFjaFRyZWUodGhpcy5mdWxsVHJlZURhdGEsIHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cuX1hfRVhQQU5EID0gZXhwYW5kZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0sIHRyZWVPcHRzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlVGFibGVEYXRhID0gdGhpcy5mdWxsVHJlZURhdGEuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRyZWVUYWJsZURhdGE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXJDaGVja2JveFJvdygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRBbGxDaGVja2JveFJvdyhmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9nZ2xlQWxsQ2hlY2tib3hSb3coKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjaGVja2JveE9wdHMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjaGVja0ZpZWxkLCBjaGVja1N0cmljdGx5IH0gPSBjaGVja2JveE9wdHM7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrRmllbGQgJiYgIWNoZWNrU3RyaWN0bHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWxsQ2hlY2tib3hSb3coIXRoaXMuZnVsbFRyZWVEYXRhLmV2ZXJ5KChyb3cpID0+IHJvd1tjaGVja0ZpZWxkXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kbmV4dFRpY2soKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRBbGxDaGVja2JveFJvdyhjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjaGVja2JveE9wdHMsIHRyZWVPcHRzIH0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tGaWVsZCwgaGFsZkZpZWxkLCBjaGVja1N0cmljdGx5IH0gPSBjaGVja2JveE9wdHM7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrRmllbGQgJiYgIWNoZWNrU3RyaWN0bHkpIHtcbiAgICAgICAgICAgICAgICAgICAgWEVVdGlscy5lYWNoVHJlZSh0aGlzLmZ1bGxUcmVlRGF0YSwgcm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tjaGVja0ZpZWxkXSA9IGNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFsZkZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2hhbGZGaWVsZF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgdHJlZU9wdHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLnhUYWJsZS5jaGVja1NlbGVjdGlvblN0YXR1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kbmV4dFRpY2soKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGVja2JveEFsbEV2ZW50KHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tlZCB9ID0gcGFyYW1zO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWxsQ2hlY2tib3hSb3coY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnY2hlY2tib3gtYWxsJywgcGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGVja2JveENoYW5nZUV2ZW50KHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcm93LCBjaGVja2VkIH0gPSBwYXJhbXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDaGVja2JveFJvdyhyb3csIGNoZWNrZWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2NoZWNrYm94LWNoYW5nZScsIHBhcmFtcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9nZ2xlQ2hlY2tib3hSb3cocm93cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tib3hPcHRzIH0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tGaWVsZCB9ID0gY2hlY2tib3hPcHRzO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja0ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENoZWNrYm94Um93KHJvdywgIXJvd1tjaGVja0ZpZWxkXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRDaGVja2JveFJvdyhyb3dzLCBjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjaGVja2JveE9wdHMsIHRyZWVPcHRzIH0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tGaWVsZCwgaGFsZkZpZWxkLCBjaGVja1N0cmljdGx5IH0gPSBjaGVja2JveE9wdHM7XG4gICAgICAgICAgICAgICAgaWYgKCFYRVV0aWxzLmlzQXJyYXkocm93cykpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93cyA9IFtyb3dzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrU3RyaWN0bHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2NoZWNrRmllbGRdID0gY2hlY2tlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFsZkZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1toYWxmRmllbGRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBYRVV0aWxzLmVhY2hUcmVlKHJvd3MsIHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2NoZWNrRmllbGRdID0gY2hlY2tlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFsZkZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1toYWxmRmllbGRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJlZU9wdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrUGFyZW50Tm9kZVNlbGVjdGlvbihyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJG5leHRUaWNrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hlY2tQYXJlbnROb2RlU2VsZWN0aW9uKHJvdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tib3hPcHRzLCB0cmVlT3B0cyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0cmVlT3B0cztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoZWNrRmllbGQsIGhhbGZGaWVsZCwgY2hlY2tTdHJpY3RseSB9ID0gY2hlY2tib3hPcHRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoT2JqID0gWEVVdGlscy5maW5kVHJlZSh0aGlzLmZ1bGxUcmVlRGF0YSwgaXRlbSA9PiBpdGVtID09PSByb3csIHRyZWVPcHRzKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hPYmogJiYgY2hlY2tGaWVsZCAmJiAhY2hlY2tTdHJpY3RseSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRSb3cgPSBtYXRjaE9iai5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWxsID0gcGFyZW50Um93W2NoaWxkcmVuXS5ldmVyeSgoaXRlbSkgPT4gaXRlbVtjaGVja0ZpZWxkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFsZkZpZWxkICYmICFpc0FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFJvd1toYWxmRmllbGRdID0gcGFyZW50Um93W2NoaWxkcmVuXS5zb21lKChpdGVtKSA9PiBpdGVtW2NoZWNrRmllbGRdIHx8IGl0ZW1baGFsZkZpZWxkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRSb3dbY2hlY2tGaWVsZF0gPSBpc0FsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tQYXJlbnROb2RlU2VsZWN0aW9uKHBhcmVudFJvdyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRyZWZzLnhUYWJsZS5jaGVja1NlbGVjdGlvblN0YXR1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldENoZWNrYm94UmVjb3JkcygpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoZWNrYm94T3B0cywgdHJlZU9wdHMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjaGVja0ZpZWxkIH0gPSBjaGVja2JveE9wdHM7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBYRVV0aWxzLmVhY2hUcmVlKHRoaXMuZnVsbFRyZWVEYXRhLCByb3cgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tjaGVja0ZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZHMucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCB0cmVlT3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvcmRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kcmVmcy54VGFibGUuZ2V0Q2hlY2tib3hSZWNvcmRzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0Q2hlY2tib3hJbmRldGVybWluYXRlUmVjb3JkcygpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoZWNrYm94T3B0cywgdHJlZU9wdHMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBoYWxmRmllbGQgfSA9IGNoZWNrYm94T3B0cztcbiAgICAgICAgICAgICAgICBpZiAoaGFsZkZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgWEVVdGlscy5lYWNoVHJlZSh0aGlzLmZ1bGxUcmVlRGF0YSwgcm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbaGFsZkZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZHMucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCB0cmVlT3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvcmRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kcmVmcy54VGFibGUuZ2V0Q2hlY2tib3hJbmRldGVybWluYXRlUmVjb3JkcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICB2eGV0YWJsZS5WdWUuY29tcG9uZW50KG9wdGlvbnMubmFtZSwgb3B0aW9ucyk7XG59XG4vKipcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE5aKe5by65o+S5Lu277yM5a6e546w566A5Y2V55qE6Jma5ouf5qCR6KGo5qC8XG4gKi9cbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpblZpcnR1YWxUcmVlID0ge1xuICAgIGluc3RhbGwodnhldGFibGUpIHtcbiAgICAgICAgcmVnaXN0ZXJDb21wb25lbnQodnhldGFibGUpO1xuICAgIH1cbn07XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlICYmIHdpbmRvdy5WWEVUYWJsZS51c2UpIHtcbiAgICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luVmlydHVhbFRyZWUpO1xufVxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5WaXJ0dWFsVHJlZTtcbiJdfQ==
