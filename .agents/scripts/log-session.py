#!/usr/bin/env python3
import sys
import json
import os
from datetime import datetime

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
sessions_file = os.path.join(project_root, "docs", "workflow", "SESSIONS.md")
plain_log = os.path.join(script_dir, "..", "sessions.log")

def log_session(conv_id, agent_name="Helper Agent", reason="Session Exit"):
    if not conv_id:
        return
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    resume_cmd = f"agy --conversation {conv_id}"
    
    # 1. Update/Append to .agents/sessions.log
    try:
        with open(plain_log, "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] [{agent_name}] ID: {conv_id} | Command: {resume_cmd} | Reason: {reason}\n")
    except Exception as e:
        sys.stderr.write(f"Error writing to sessions.log: {e}\n")

    # 2. Update/Create docs/workflow/SESSIONS.md
    try:
        os.makedirs(os.path.dirname(sessions_file), exist_ok=True)
        content = ""
        if os.path.exists(sessions_file):
            with open(sessions_file, "r", encoding="utf-8") as f:
                content = f.read()
        
        entry = (
            f"| **{agent_name}** | `{conv_id}` | `{resume_cmd}` | {timestamp} |\n"
        )
        
        if not content or "# Agent Sessions & Resume Commands" not in content:
            new_content = (
                "# Agent Sessions & Resume Commands\n\n"
                "Log of conversation sessions with commands to reopen them.\n\n"
                "## Active & Recent Sessions\n\n"
                "| Chat / Agent Name | Conversation ID | Resume Command | Last Logged |\n"
                "| :--- | :--- | :--- | :--- |\n"
                + entry + "\n"
                "## Historical Session Log\n\n"
                f"- **[{timestamp}]** {agent_name} (`{conv_id}`): `{resume_cmd}`\n"
            )
            with open(sessions_file, "w", encoding="utf-8") as f:
                f.write(new_content)
        else:
            # Append historical record
            history_bullet = f"- **[{timestamp}]** {agent_name} (`{conv_id}`): `{resume_cmd}`\n"
            if "## Historical Session Log" in content:
                parts = content.split("## Historical Session Log\n")
                updated_content = parts[0] + "## Historical Session Log\n" + history_bullet + parts[1]
            else:
                updated_content = content + "\n## Historical Session Log\n" + history_bullet
            with open(sessions_file, "w", encoding="utf-8") as f:
                f.write(updated_content)
    except Exception as e:
        sys.stderr.write(f"Error writing to SESSIONS.md: {e}\n")

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
    hook_event = data.get("hookEventName") or ""
    
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
    
    if is_exit_cmd or hook_event == "Stop":
        reason = "User Exit Command" if is_exit_cmd else f"Stop Event ({data.get('terminationReason', 'TERMINATION')})"
        log_session(conv_id, agent_name=agent_name, reason=reason)
    
    if hook_event == "PreInvocation":
        inject_steps = []
        if is_exit_cmd and conv_id:
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
    elif hook_event == "Stop":
        print(json.dumps({
            "decision": "stop"
        }))
    else:
        print(json.dumps({}))

if __name__ == "__main__":
    main()
