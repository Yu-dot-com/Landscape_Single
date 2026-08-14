      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["own_projects"] }),
        queryClient.invalidateQueries({ queryKey: ["project_count"] }),
      ]);
