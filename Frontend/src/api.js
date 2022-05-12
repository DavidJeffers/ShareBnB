import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:5001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ShareBnBApi {
  // Remember, the backend needs to be authorized with a token
  // We're providing a token you can use to interact with the backend API
  // DON'T MODIFY THIS TOKEN
  static token;

  static async request(endpoint, data = {}, method = "get") {
    // console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  static async login(formData) {
    let res = await this.request(`login`, formData, "post");
    return res;
  }

  static async register(formData) {
    let res = await this.request(`register`, formData, "post");
    return res;
  }

  static async getListings() {
    let listings = await this.request(`listings`);
    return listings;
  }

  static async addListing(formData) {
    let listing = await this.request(`listings`, formData, "post");
    return listing;
  }

  static async addPhoto(formData, listing_id) {
    let photo = await this.request(
      `/listings/${listing_id}/upload`,
      formData,
      "post"
    );
    return photo;
  }

  static async getListing(listing_id) {
    let listing = await this.request(`listings/${listing_id}`);
    return listing;
  }

  static async rentListing(formData, listing_id) {
    let listing = await this.request(
      `listings/${listing_id}/rent`,
      formData,
      "patch"
    );
    return listing;
  }

  static async cancelListing(formData, listing_id) {
    let listing = await this.request(
      `listings/${listing_id}/cancel`,
      formData,
      "patch"
    );
    return listing;
  }

  static async getSentMessages() {
    let messages = await this.request(`messages/sent`);
    return messages;
  }

  static async getReceivedMessages() {
    let messages = await this.request(`messages/received`);
    return messages;
  }

  static async sendMessage(formData) {
    let message = await this.request(`messages/send`, formData, "post");
    return message;
  }
}

export default ShareBnBApi;
