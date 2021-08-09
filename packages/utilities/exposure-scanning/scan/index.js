const replacementStr = '*';

export const scanText = (text, regex) => {
  const scannedText = text.replace(regex, replacementStr);
  const foundTextMatch = scannedText !== text;

  return { body: scannedText, foundTextMatch };
};

export const scanComments = (comments, regex) => {
  const scannedComments = comments
    .map(({ id, body }) => {
      if (regex.test(body)) {
        return {
          id,
          body: body.replace(regex, replacementStr),
        };
      }
      return false;
    })
    .filter(Boolean);
  const foundCommentMatch = scannedComments.length > 0;

  return { comments: scannedComments, foundCommentMatch };
};

export const scanPr = (pr, regex) => {
  let scannedPr = pr;
  let foundMatch = false;

  try {
    const { body, foundTextMatch } = scanText(pr.body, regex);
    const { comments, foundCommentMatch } = scanComments(pr.comments, regex);
    const {
      comments: reviewComments,
      foundCommentMatch: foundReviewCommentsMatch,
    } = scanComments(pr.reviewComments, regex);

    scannedPr = {
      body,
      comments,
      reviewComments,
    };

    foundMatch =
      foundTextMatch || foundCommentMatch || foundReviewCommentsMatch;
  } catch (error) {
    throw new Error('Encountered an error when scanning.');
  }

  return { ...scannedPr, foundMatch };
};

export const scanIssue = (issue, regex) => {
  let scannedIssue = issue;
  let foundMatch = false;

  try {
    const { body, foundTextMatch } = scanText(issue.body, regex);
    const { comments, foundCommentMatch } = scanComments(issue.comments, regex);

    scannedIssue = {
      body,
      comments,
    };

    foundMatch = foundTextMatch || foundCommentMatch;
  } catch (error) {
    throw new Error('Encountered an error when scanning.');
  }

  return { ...scannedIssue, foundMatch };
};
