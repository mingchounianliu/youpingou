export default {
  namespaced: true,

  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      //console.log("11",findResult)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }
      // console.log("22",state.cart)
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    //更新商品数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
        findResult.goods_count = goods.goods_count

        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)

      console.log("过滤后的数据", state.cart, goods_id);
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(item => item.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  getters: {
    //购物车中所有商品的总数量
    total(state) {
      // let c = 0
      // state.cart.forEach(x => c += x.goods_count)
      // return c
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },

    //购物车中已勾选的商品总数量
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    
    //已勾选的商品总价格
    checkdGoodsAmount(state){
      console.log(state.cart);
      return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total+=item.goods_count * item.goods_price,0).toFixed(2)
    }
  },
}
