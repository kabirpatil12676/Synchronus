import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import apiClient from "@/lib/api-client";
import { SUBMIT_FEEDBACK_ROUTE } from "@/lib/constants";
import { toast } from "sonner";
import { useAppStore } from "@/store";

const Feedback = () => {
    const navigate = useNavigate();
    const { userInfo } = useAppStore();
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!userInfo?.profileSetup) {
            toast("Please setup profile to continue.");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        if (!feedbackText.trim()) {
            toast.error("Please enter your feedback.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiClient.post(
                SUBMIT_FEEDBACK_ROUTE,
                { rating, feedback: feedbackText },
                { withCredentials: true }
            );
            if (response.status === 201) {
                toast.success("Thank you for your feedback!");
                setRating(0);
                setFeedbackText("");
                setTimeout(() => {
                    navigate("/chat");
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col">
            <div className="w-[90vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] bg-[#2a2b33] rounded-2xl shadow-2xl p-8 flex flex-col pt-10 border border-[#2f303b]">
                <div className="flex items-center justify-between mb-8">
                    <ArrowLeft
                        className="text-neutral-300 w-6 h-6 cursor-pointer hover:text-white transition-all duration-300"
                        onClick={() => navigate("/chat")}
                    />
                    <h2 className="text-2xl font-bold text-white tracking-wide">
                        App Feedback
                    </h2>
                    <div className="w-6 h-6"></div> {/* Spacer for alignment */}
                </div>

                <p className="text-neutral-400 text-sm mb-6 text-center">
                    We value your input! Let us know how we can improve your experience.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-neutral-300 text-sm font-medium">Rate your experience</label>
                        <div className="flex gap-2 justify-center py-4 bg-[#1b1c24] rounded-lg">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-transform duration-200 hover:scale-125 ${star <= rating ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-neutral-600"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-neutral-300 text-sm font-medium">Tell us more</label>
                        <textarea
                            className="w-full bg-[#1b1c24] border border-[#2f303b] rounded-lg p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-[#741bda] focus:ring-1 focus:ring-[#741bda] transition-all duration-300 resize-none h-32"
                            placeholder="What do you like? What could be better?"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#741bda] hover:bg-[#5b15a9] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Submit Feedback</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
