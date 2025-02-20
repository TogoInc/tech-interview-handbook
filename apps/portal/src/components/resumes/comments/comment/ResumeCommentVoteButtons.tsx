import clsx from 'clsx';
import { useState } from 'react';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/20/solid';
import { Vote } from '@prisma/client';

import { trpc } from '~/utils/trpc';

type ResumeCommentVoteButtonsProps = {
  commentId: string;
  userId: string | undefined;
};

export default function ResumeCommentVoteButtons({
  commentId,
  userId,
}: ResumeCommentVoteButtonsProps) {
  const [upvoteAnimation, setUpvoteAnimation] = useState(false);
  const [downvoteAnimation, setDownvoteAnimation] = useState(false);

  const trpcContext = trpc.useContext();

  // COMMENT VOTES
  const commentVotesQuery = trpc.useQuery([
    'resumes.comments.votes.list',
    { commentId },
  ]);
  const commentVotesUpsertMutation = trpc.useMutation(
    'resumes.comments.votes.user.upsert',
    {
      onSuccess: () => {
        // Comment updated, invalidate query to trigger refetch
        trpcContext.invalidateQueries(['resumes.comments.votes.list']);
      },
    },
  );
  const commentVotesDeleteMutation = trpc.useMutation(
    'resumes.comments.votes.user.delete',
    {
      onSuccess: () => {
        // Comment updated, invalidate query to trigger refetch
        trpcContext.invalidateQueries(['resumes.comments.votes.list']);
      },
    },
  );

  const onVote = async (value: Vote, setAnimation: (_: boolean) => void) => {
    setAnimation(true);

    if (commentVotesQuery.data?.userVote?.value === value) {
      return commentVotesDeleteMutation.mutate(
        {
          commentId,
        },
        {
          onSettled: async () => setAnimation(false),
        },
      );
    }
    return commentVotesUpsertMutation.mutate(
      {
        commentId,
        value,
      },
      {
        onSettled: async () => setAnimation(false),
      },
    );
  };

  return (
    <>
      <button
        disabled={
          !userId ||
          commentVotesQuery.isLoading ||
          commentVotesUpsertMutation.isLoading ||
          commentVotesDeleteMutation.isLoading
        }
        type="button"
        onClick={() => onVote(Vote.UPVOTE, setUpvoteAnimation)}>
        <ArrowUpCircleIcon
          className={clsx(
            'h-4 w-4',
            commentVotesQuery.data?.userVote?.value === Vote.UPVOTE ||
              upvoteAnimation
              ? 'fill-indigo-500'
              : 'fill-gray-400',
            userId &&
              !downvoteAnimation &&
              !upvoteAnimation &&
              'hover:fill-indigo-500',
            upvoteAnimation && 'animate-[bounce_0.5s_infinite] cursor-default',
          )}
        />
      </button>

      <div className="flex min-w-[1rem] justify-center text-xs">
        {commentVotesQuery.data?.numVotes ?? 0}
      </div>

      <button
        disabled={
          !userId ||
          commentVotesQuery.isLoading ||
          commentVotesUpsertMutation.isLoading ||
          commentVotesDeleteMutation.isLoading
        }
        type="button"
        onClick={() => onVote(Vote.DOWNVOTE, setDownvoteAnimation)}>
        <ArrowDownCircleIcon
          className={clsx(
            'h-4 w-4',
            commentVotesQuery.data?.userVote?.value === Vote.DOWNVOTE ||
              downvoteAnimation
              ? 'fill-red-500'
              : 'fill-gray-400',
            userId &&
              !downvoteAnimation &&
              !upvoteAnimation &&
              'hover:fill-red-500',
            downvoteAnimation &&
              'animate-[bounce_0.5s_infinite] cursor-default',
          )}
        />
      </button>
    </>
  );
}
