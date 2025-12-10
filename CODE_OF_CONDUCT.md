# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community focused on advancing privacy-preserving smart contracts through Fully Homomorphic Encryption.

---

## Our Standards

### Positive Behavior

Examples of behavior that contributes to a positive environment for our community include:

- **Respectful Communication**: Using welcoming and inclusive language
- **Constructive Feedback**: Providing helpful, actionable suggestions
- **Collaboration**: Working together to improve the FHE ecosystem
- **Knowledge Sharing**: Teaching and learning FHE concepts together
- **Professionalism**: Maintaining professional conduct in all interactions
- **Empathy**: Understanding different perspectives and experience levels
- **Attribution**: Giving credit where credit is due
- **Focus**: Staying on topic and respecting everyone's time

### Unacceptable Behavior

Examples of unacceptable behavior include:

- **Harassment**: Any form of harassment, public or private
- **Trolling**: Deliberate inflammatory or offensive comments
- **Personal Attacks**: Insulting or derogatory comments about individuals
- **Discrimination**: Discriminatory jokes, language, or behavior
- **Doxxing**: Publishing others' private information without permission
- **Spam**: Unsolicited advertising or off-topic content
- **Plagiarism**: Claiming others' work as your own
- **Bad Faith**: Intentionally submitting buggy or malicious code
- **Inappropriate Content**: Sexual language, imagery, or advances of any kind
- **Intimidation**: Threatening behavior or language

---

## Community Responsibilities

### For All Community Members

1. **Be Welcoming**: Help newcomers feel included
2. **Be Patient**: Remember that everyone has different skill levels
3. **Be Clear**: Provide context when asking questions or reporting issues
4. **Be Respectful**: Disagree constructively and professionally
5. **Be Open**: Accept constructive criticism graciously

### For Contributors

1. **Quality Code**: Submit well-tested, documented code
2. **Follow Guidelines**: Adhere to CONTRIBUTING.md standards
3. **Respect Reviews**: Accept feedback from code reviewers
4. **Security First**: Report vulnerabilities responsibly
5. **Attribution**: Credit sources and collaborators

### For Maintainers

1. **Fair Review**: Review contributions objectively and promptly
2. **Clear Communication**: Provide clear feedback on submissions
3. **Inclusive Decisions**: Consider diverse perspectives
4. **Transparency**: Communicate project decisions openly
5. **Leadership**: Model positive behavior for the community

---

## Scope

This Code of Conduct applies to:

- **Repository Spaces**: Issues, pull requests, discussions, code
- **Communication Channels**: Discord, email, forums, social media
- **Events**: Conferences, meetups, workshops (virtual or in-person)
- **Official Channels**: Any space representing this project

The Code of Conduct also applies when representing the project in public spaces, including using project email addresses, social media accounts, or acting as an appointed representative.

---

## Enforcement

### Reporting

If you experience or witness unacceptable behavior, please report it:

1. **GitHub Issues**: For public discussions (if appropriate)
2. **Direct Contact**: Email project maintainers privately
3. **Anonymous Report**: Use GitHub's anonymous reporting features

**What to Include in Reports**:
- Description of the incident
- Date and time
- Individuals involved
- Supporting evidence (screenshots, logs)
- Impact on you or others

### Response Timeline

- **24 hours**: Initial acknowledgment
- **72 hours**: Preliminary investigation
- **1 week**: Resolution or status update

### Confidentiality

All reports will be handled with discretion. We will protect the identity of reporters unless legally required to disclose.

---

## Enforcement Guidelines

Community leaders will follow these guidelines when determining consequences:

### 1. Correction

**Behavior**: Minor unprofessional or unwelcome behavior

**Consequence**: Private written warning with clarity about the violation and why it was inappropriate. A public apology may be requested.

**Example**: Using inappropriate language in a pull request comment

### 2. Warning

**Behavior**: Violation through a single incident or series of actions

**Consequence**: Warning with consequences for continued behavior. No interaction with involved parties for a specified period, including unsolicited communication and public spaces. Violating these terms may lead to a temporary or permanent ban.

**Example**: Repeated unconstructive criticism after being asked to stop

### 3. Temporary Ban

**Behavior**: Serious violation of community standards, including sustained inappropriate behavior

**Consequence**: Temporary ban from any interaction or public communication with the project community for a specified period. No public or private interaction with involved parties is allowed during this period. Violating these terms may lead to a permanent ban.

**Example**: Publishing others' private information or sustained harassment

### 4. Permanent Ban

**Behavior**: Demonstrating a pattern of violation, including sustained inappropriate behavior, harassment, or aggression toward individuals or classes of individuals

**Consequence**: Permanent ban from any public interaction within the project community.

**Example**: Repeated violations after warnings, threats, or systematic harassment

---

## FHE Community-Specific Guidelines

### Technical Discussions

1. **Accuracy**: Ensure technical information is accurate
2. **Security**: Never encourage insecure FHE practices
3. **Learning**: Support those learning FHE concepts
4. **Complexity**: Acknowledge FHE's complexity and be patient

### Code Reviews

1. **Constructive**: Focus on improving code, not criticizing people
2. **Specific**: Provide concrete suggestions
3. **FHE Patterns**: Help enforce correct FHE usage patterns
4. **Security**: Highlight security concerns respectfully

### Example Interactions

#### ✅ GOOD Example

```markdown
**Reviewer**: "This looks good overall! One security concern: you're missing `FHE.allowThis()`
on line 42. Without it, the contract won't be able to operate on the encrypted value.
Here's the correct pattern:

```solidity
euint32 encrypted = FHE.asEuint32(value);
FHE.allowThis(encrypted);  // Add this
FHE.allow(encrypted, msg.sender);
```

Check out the FHECounter example for reference."
```

#### ❌ BAD Example

```markdown
**Reviewer**: "This is wrong and shows you don't understand FHE at all. Did you even
read the docs? This will never work."
```

---

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 2.1, available at [https://www.contributor-covenant.org/version/2/1/code_of_conduct.html][v2.1].

Community Impact Guidelines were inspired by [Mozilla's code of conduct enforcement ladder][Mozilla CoC].

For answers to common questions about this code of conduct, see the FAQ at [https://www.contributor-covenant.org/faq][FAQ]. Translations are available at [https://www.contributor-covenant.org/translations][translations].

[homepage]: https://www.contributor-covenant.org
[v2.1]: https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
[Mozilla CoC]: https://github.com/mozilla/diversity
[FAQ]: https://www.contributor-covenant.org/faq
[translations]: https://www.contributor-covenant.org/translations

---

## Privacy-Preserving Technologies and Ethics

As a project focused on privacy-preserving technologies, we hold ourselves to high ethical standards:

### Ethical Use of FHE

1. **Educational Purpose**: Use FHE knowledge for learning and legitimate applications
2. **Responsible Development**: Build systems that respect user privacy
3. **Transparency**: Be open about how encrypted data is handled
4. **Security**: Never deliberately create vulnerable FHE implementations
5. **Compliance**: Respect applicable laws and regulations

### Prohibited Uses

Do not use knowledge from this project to:
- Develop systems that violate privacy laws
- Create malicious or deceptive applications
- Circumvent security measures without authorization
- Misrepresent FHE capabilities or limitations

---

## Recognition

We value and recognize positive contributions to the community:

### Recognition Methods

- **Contributor List**: Recognition in project documentation
- **Release Notes**: Acknowledgment in release announcements
- **Community Highlights**: Featured contributions in discussions
- **Maintainer Nominations**: Outstanding contributors may be invited to become maintainers

### Contribution Types Recognized

- Code contributions (features, bug fixes)
- Documentation improvements
- Educational content creation
- Community support and mentoring
- Security vulnerability reports
- Testing and quality assurance
- Translation and localization

---

## Questions or Concerns

If you have questions about this Code of Conduct or need clarification:

1. **Open Discussion**: Create a GitHub Discussion
2. **Private Inquiry**: Contact maintainers directly
3. **Community Forums**: Ask in Zama Community channels

---

## Amendments

This Code of Conduct may be updated periodically. Community members will be notified of significant changes. The latest version is always available in this repository.

**Version**: 1.0
**Last Updated**: December 2025
**Next Review**: June 2026

---

## Our Commitment

We are committed to providing a welcoming and inspiring community for all. We will:

- Enforce this Code of Conduct fairly and consistently
- Listen to community feedback
- Continuously improve our processes
- Lead by example
- Foster an environment where everyone can contribute

Thank you for being part of the FHEVM Example Hub community and helping advance privacy-preserving smart contract technology!

---

## Additional Resources

- **CONTRIBUTING.md**: Contribution guidelines and processes
- **SECURITY.md**: Security reporting and best practices
- **DEVELOPER_GUIDE.md**: Technical development guide
- **README.md**: Project overview and getting started

---

**Contact**: See README.md for community channels and maintainer contact information.
