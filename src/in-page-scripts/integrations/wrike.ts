﻿module Integrations {

    class Wrike implements WebToolIntegration {

        showIssueId = false;

        observeMutations = true;

        matchUrl = '*://www.wrike.com/workspace.htm#*';

        issueElementSelector = '.wspace-task-view';

        render(issueElement: HTMLElement, linkElement: HTMLElement) {
            let host = $$('.wrike-panel-header-toolbar', issueElement);
            if (host) {
                host.insertBefore(linkElement, host.firstElementChild);
            }
        }

        getIssue(issueElement: HTMLElement, source: Source): WebToolIssue {

            let issueName = $$.try<HTMLTextAreaElement>('.wspace-task-widgets-title-view textarea', issueElement).value;
            if (!issueName) {
                return;
            }

            let params = $$.searchParams(document.location.hash);
            let issueId = params['t'] || params['ot'];
            let issueUrl: string;
            if (issueId) {
                issueUrl = '/open.htm?id=' + issueId;
                issueId = '#' + issueId;
            }

            let issueTags = $$.all('.wspace-task-widgets-tags-dataview > div', issueElement);
            let projectName: string;
            if (issueTags.length == 1) {
                projectName = issueTags[0].textContent;
            }

            let serviceType = 'Wrike';

            let serviceUrl = source.protocol + source.host;

            return { issueId, issueName, projectName, serviceType, serviceUrl, issueUrl };
        }
    }

    IntegrationService.register(new Wrike());
}