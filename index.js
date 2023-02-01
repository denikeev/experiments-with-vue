Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `<ul>
    <li v-for="detail in details">{{ detail }}</li>
  </ul>`,
});

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `<div class="product">
    <div class="product-image">
      <img :src="image">
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else :class="outOfStockClasses">Out of Stock</p>
    </div>
    <p>Shipping: {{ shipping }}</p>
    <product-details :details="details"></product-details>
    <div
      v-for="(variant, index) in variants" 
      :key="variant.variantId" 
      class="color-box"
      :style="{ backgroundColor: variant.variantColor }"
      @mouseover="updateProduct(index)">        
    </div>
    <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>
    <button @click="deleteCart">Delete this from cart</button>
  </div>`,

  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      onSale: true,
      selectedVariant: 0,
      details: ['80% cotton', '20% polyester', 'Male-neutral'],
      variants: [
        {
          variantId: 1,
          variantColor: 'green',
          variantImage: 'https://dummyimage.com/150x150/ff4200/ffffff.jpg',
          variantQuantity: 10,
        },
        {
          variantId: 2,
          variantColor: 'blue',
          variantImage: 'https://dummyimage.com/150x150/0015ee/ffffff.jpg',
          variantQuantity: 0,
        },
      ],
      outOfStockClasses: {
        'through-line': !this.inStock,
      },
    };
  },
  
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    },
    deleteCart() {
      this.$emit('delete-cart', this.variants[this.selectedVariant].variantId);
    },
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      return this.premium ? 'Free' : 2.99;
    }
  },
});

const app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    deleteCart(id) {
      this.cart = this.cart.filter((itemId) => itemId !== id);
    },
  },
});