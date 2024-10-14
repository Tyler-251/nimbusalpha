import json

start = """{'messageVersion': '1.0', 'function': 'AddDescription', 'parameters': [{'name': 'description', 'type': 'string', 'value': 'yipee'}, {'name': 'json', 'type': 'string', 'value': '{"queryType": "create", "events": [{"title": "todays event", "startDateTime": "2023-05-16T00:00", "endDateTime": "2023-05-16T23:59"}]}'}], 'sessionId': '617057808357326', 'agent': {'name': 'nimbus-alpha-agent', 'version': 'DRAFT', 'id': 'QLNAQZAVCZ', 'alias': 'TSTALIASID'}, 'sessionAttributes': {}, 'promptSessionAttributes': {}, 'inputText': 'make an event today with the description "yipee" called todays event', 'actionGroup': 'action-group-add-descriptions'}"""

start = start.replace("'", '"');

print(start)

{"messageVersion": "1.0", "function": "AddDescription", "parameters": [{"name": "description", "type": "string", "value": "yipee"}, {"name": "json", "type": "string", "value": """{"queryType": "create", "events": [{"title": "todays event", "startDateTime": "2023-05-16T00:00", "endDateTime": "2023-05-16T23:59"}]}"""}], "sessionId": "617057808357326", "agent": {"name": "nimbus-alpha-agent", "version": "DRAFT", "id": "QLNAQZAVCZ", "alias": "TSTALIASID"}, "sessionAttributes": {}, "promptSessionAttributes": {}, "inputText": "make an event today with the description 'yipee' called todays event", "actionGroup": "action-group-add-descriptions"}