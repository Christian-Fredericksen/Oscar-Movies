class ReviewsController < ApplicationController
    def new
        review = Reviews.new
    end

    def create
        review = Review.new(review_params)
        # current_user.review.build(review_params)
        if review.save
            render json: review, except: [:created_at, :updated_at]
        else
            render json: {message: "Review Failed"}
        end
    end

    def index
        user_id = params[:user_id]
        user = User.find(user_id)
        reviews = user.reviews
        render json: reviews, include: [:movie]
        # rendering related object data in JSON by nesting models
        # result:
          #       {
          # "id": 2,
          # "user_id": 1,
          # "game": {
          #   "id": 4,
          #   "title": "",
          #   "category": "",
          #   "created_at": "2019-05-14T11:20:37.177Z",
          #   "updated_at": "2019-05-14T11:20:37.177Z"
          # }
    end

    def destroy
        review_id = params[:id]
        review = Review.find(review_id)
        review.destroy
    end


private
    def review_params
      params.require(:review).permit(:user_id, :movie_id)
    end
end
