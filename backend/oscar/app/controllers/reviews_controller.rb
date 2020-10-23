class ReviewsController < ApplicationController
    def new
        review = Reviews.new
    end

    def create
        review = Review.new(review_params)
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
