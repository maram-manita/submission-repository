sequenceDiagram
participant browser
participant server

    Note right of browser: User writes a note and clicks Save

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: { "status": "success" }
    deactivate server

    Note right of browser: JavaScript updates notes list without reloading the page
