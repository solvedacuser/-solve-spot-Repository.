export const LEETCODE_USER_QUERY = /* GraphQL */ `
  query LeetCodeUser($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        ranking
        userAvatar
        realName
        aboutMe
        reputation
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

export const LEETCODE_RECENT_ACCEPTED_QUERY = /* GraphQL */ `
  query RecentAcceptedSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      titleSlug
      timestamp
    }
  }
`;

export const LEETCODE_PROBLEMSET_QUERY = /* GraphQL */ `
  query ProblemsetQuestionList(
    $categorySlug: String
    $limit: Int
    $skip: Int
    $filters: QuestionListFilterInput
  ) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        titleSlug
        title
        difficulty
        questionFrontendId
        acRate
        paidOnly: isPaidOnly
        topicTags {
          name
          slug
        }
      }
    }
  }
`;
