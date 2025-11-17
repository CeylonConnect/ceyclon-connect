import React from 'react';
import { useForm } from 'react-hook-form';

export default function Review({initial = {rating: 5, review_text: " "}, onSubmit, loading  }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initial });

    return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div>
        <label>Rating</label>
        <select {...register("rating", { required: true })}>
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
        </select>
        {errors.rating && <div className="text-red-500">Rating is required</div>}
      </div>

      <div>
        <label>Review</label>
        <textarea {...register("review_text", { required: true, minLength: 5 })} rows={4}/>
        {errors.review_text && <div className="text-red-500">Write at least 5 characters</div>}
      </div>

      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Submit Review"}</button>
    </form>
  );
}