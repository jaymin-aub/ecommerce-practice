#!/usr/bin/env python3
import sys
import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
sessions_file = os.path.join(project_root, "docs", "workflow", "SESSIONS.md")

def update_session(conv_id, agent_name="Helper Agent"):
    if not conv_id:
        return

    resume_cmd = f"agy --conversation {conv_id}"
    os.makedirs(os.path.dirname(sessions_file), exist_ok=True)

    rows = {}
    if os.path.exists(sessions_file):
        with open(sessions_file, "r", encoding="utf-8") as f:
            for line in f:
                if "|" in line:
                    parts = [p.strip() for p in line.split("|")]
                    if len(parts) >= 4 and parts[1] and parts[1] != "Chat / Agent Name" and not parts[1].startswith(":-"):
                        name = parts[1].replace("*", "").strip()
                        c_id = parts[2].replace("`", "").strip()
                        cmd = parts[3].replace("`", "").strip()
                        rows[name] = (c_id, cmd)

    rows[agent_name] = (conv_id, resume_cmd)

    new_content = (
        "# Agent Sessions\n\n"
        "| Chat / Agent Name | Conversation ID | Resume Command |\n"
        "| :--- | :--- | :--- |\n"
    )
    for name, (c_id, cmd) in sorted(rows.items()):
        new_content += f"| **{name}** | `{c_id}` | `{cmd}` |\n"

    with open(sessions_file, "w", encoding="utf-8") as f:
        f.write(new_content)

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({}))
            return
        data = json.loads(raw_input)
    except Exception as e:
        sys.stderr.write(f"Error reading hook input: {e}\n")
        print(json.dumps({}))
        return

    conv_id = data.get("conversationId") or os.environ.get("CONVERSATION_ID", "")
    last_user_input = (data.get("lastUserInput") or "").strip().lower()

    agent_name = "Helper Agent"
    if conv_id and os.path.exists(sessions_file):
        try:
            with open(sessions_file, "r", encoding="utf-8") as f:
                for line in f:
                    if conv_id in line and "|" in line:
                        parts = [p.strip() for p in line.split("|")]
                        if len(parts) >= 3 and parts[1]:
                            name = parts[1].replace("*", "").strip()
                            if name:
                                agent_name = name
                                break
        except Exception:
            pass

    is_exit_cmd = last_user_input.startswith(("/exit", "exit", "/quit", "quit", ":q"))

    inject_steps = []
    if is_exit_cmd and conv_id:
        update_session(conv_id, agent_name=agent_name)
        inject_steps.append({
            "systemMessage": {
                "systemMessage": f"Session logged: agy --conversation {conv_id}",
                "metadata": {
                    "user_markdown": (
                        f"> 💾 **{agent_name} Session Saved**\n>\n"
                        f"> To resume this exact conversation later, run:\n"
                        f"> ```bash\n> agy --conversation {conv_id}\n> ```"
                    )
                }
            }
        })

    print(json.dumps({
        "injectSteps": inject_steps,
        "terminationBehavior": ""
    }))

if __name__ == "__main__":
    main()
