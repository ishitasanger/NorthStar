from agent.context_manager import InterviewContext

# 1. Create temporary interview context
context = InterviewContext()

# 2. Load candidates.json and curriculum.json
context.load_data()

print("Candidates loaded:", len(context.candidates))
print("Curriculum loaded:", context.curriculum["cohort"])

# 3. SELECT A CANDIDATE
candidate_id = "CAND-003"

candidate = context.select_candidate(candidate_id)

# 4. Check whether selection worked
if candidate:
    print("\nCandidate selected successfully!")

    print("\nCandidate Profile:")
    print(candidate["member"])

    print("\nCandidate Missions:")
    for mission in candidate["missions"]:
        print("-", mission["title"])

    print("\nCandidate Signals:")
    print(candidate["signals"])

else:
    print("\nCandidate not found!")

# 5. Check that the selected candidate is stored in context
print("\nStored candidate:")
print(context.candidate["member"])

# 6. Check curriculum
print("\nCurriculum loaded:")
print(context.curriculum["cohort"])

# 7. Check interview history
print("\nInitial interview history:")
print(context.get_history())