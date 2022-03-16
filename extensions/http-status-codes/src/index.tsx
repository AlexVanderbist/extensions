import { ActionPanel, Action, Icon, List } from "@raycast/api";
import React from "react";
import http from "http";

type Code = {
  code: string;
  description: string;
};

export default function Command() {
  const codeGroups = Object.entries(http.STATUS_CODES)
    .reduce((groups: { [firstDigit: string]: Code[] }, [code, description]) => {
      const group = groups[code[0]] || [];
      group.push({ code, description });
      groups[code[0]] = group;

      return groups;
    }, {});

  return (
    <List isLoading={false} searchBarPlaceholder="Filter by code or description...">
      {Object.entries(codeGroups).map(([firstDigit, codes]) => (
        <List.Section key={firstDigit} title={`${firstDigit}xx`} subtitle={getCodeGroupDescription(firstDigit)}>
          {codes.map((code) => (
            <List.Item
              key={code.code}
              title={code.code}
              subtitle={code.description}
              keywords={[code.description]} // make subtitle searchable
              icon={{
                source: Icon.Dot,
                tintColor: statusCodeToColor(code.code)
              }}
              actions={
                <ActionPanel>
                  <Action.OpenInBrowser
                    title="Open in browser"
                    url={getCodeDocsUrl(code.code)}
                  />
                  <Action.CopyToClipboard content={code.code} />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

// Based on Steve Schoger's https://www.steveschoger.com/status-code-poster/
function statusCodeToColor(status: string): string {
  switch (status[0]) {
    case "1":
      return "#cff9fe";
    case "2":
      return "#d4f7ae";
    case "3":
      return "#cdc7ff";
    case "4":
      return "#f9f4b5";
    case "5":
      return "#fbb7b7";
    default:
      return "#ffffff";
  }
}

function getCodeGroupDescription(firstDigit: string): string {
  switch (firstDigit) {
    case "1":
      return "Informational response – the request was received, continuing process";
    case "2":
      return "Successful – the request was successfully received, understood, and accepted";
    case "3":
      return "Redirection – further action needs to be taken in order to complete the request";
    case "4":
      return "Client error – the request contains bad syntax or cannot be fulfilled";
    case "5":
      return "Server error – the server failed to fulfil an apparently valid request";
    default:
      return "";
  }
}

function getCodeDocsUrl(code: string): string {
  const codesWithoutDocs = ["102", "207", "208", "226", "305", "421", "423", "424", "509"];

  if (codesWithoutDocs.includes(code)) {
    return "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status";
  }

  return `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`;
}
