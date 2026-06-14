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
