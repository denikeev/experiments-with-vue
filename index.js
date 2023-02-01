Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name">
    </p>
    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model.number="review"></textarea>
    </p>
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
    <p>Would you recommend this product?</p>
      <label>Yes
        <input type="radio" value="yes" v-model="recommend">Yes
      </label>
      <label>No
        <input type="radio" value="No" v-model="recommend">
      </label>
    <p>
      <input type="submit" value="Submit">
    </p>
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        this.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
          if(!this.name) this.errors.push('Name required.');
          if(!this.review) this.errors.push('Rewiew required.');
          if(!this.rating) this.errors.push('Rating required.');
          if(!this.recommend) this.errors.push('Recommend required.');
      }
    },
  },
});

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
    
    <div>
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          <p>{{ review.recommend }}</p>
        </li>
      </ul>
    </div>

    <product-review @review-submitted="addReview"></product-review>
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
      reviews: [],
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
    addReview(productReview) {
      this.reviews.push(productReview);
    }
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