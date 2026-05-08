import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collaborationService } from "@/services/collaboration.service";
import type { NewPostDTO } from "@/services/collaboration.service";
import type { Post } from "@/components/features/collaboration-wall/PostCard";

export const usePosts = () =>
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      collaborationService.getPosts(pageParam as number),
    getNextPageParam: (lastPage: Post[], pages: Post[][]) =>
      lastPage.length === 10 ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewPostDTO) => collaborationService.createPost(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => collaborationService.likePost(postId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useAddComment = () =>
  useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      collaborationService.addComment(postId, content),
  });
