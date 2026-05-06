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

export const LEETCODE_LANGUAGE_QUERY = /* GraphQL */ `
  query LeetCodeLanguageStats($username: String!) {
    matchedUser(username: $username) {
      username
      languageProblemCount {
        languageName
        problemsSolved
      }
    }
  }
`;

export const LEETCODE_SKILL_QUERY = /* GraphQL */ `
  query LeetCodeSkillStats($username: String!) {
    matchedUser(username: $username) {
      username
      tagProblemCounts {
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
`;

export const LEETCODE_CALENDAR_QUERY = /* GraphQL */ `
  query LeetCodeUserCalendar($username: String!, $year: Int!) {
    matchedUser(username: $username) {
      username
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        dccBadges {
          timestamp
          badge {
            name
            icon
          }
        }
        submissionCalendar
      }
    }
  }
`;

export const LEETCODE_CONTEST_QUERY = /* GraphQL */ `
  query LeetCodeContest($username: String!) {
    matchedUser(username: $username) {
      username
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
    userContestRankingHistory(username: $username) {
      attended
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      rating
      ranking
      contest {
        title
        startTime
      }
    }
  }
`;
