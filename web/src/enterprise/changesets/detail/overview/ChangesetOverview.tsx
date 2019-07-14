import H from 'history'
import React from 'react'
import { Link } from 'react-router-dom'
import { ExtensionsControllerProps } from '../../../../../../shared/src/extensions/controller'
import * as GQL from '../../../../../../shared/src/graphql/schema'
import { pluralize } from '../../../../../../shared/src/util/strings'
import { Timestamp } from '../../../../components/time/Timestamp'
import { Timeline } from '../../../../components/timeline/Timeline'
import { PersonLink } from '../../../../user/PersonLink'
import { ActionsIcon, GitPullRequestIcon } from '../../../../util/octicons'
import { ChecksIcon } from '../../../checks/icons'
import { ThreadStatusBadge } from '../../../threads/components/threadStatus/ThreadStatusBadge'
import { ThreadHeaderEditableTitle } from '../../../threads/detail/header/ThreadHeaderEditableTitle'
import { ThreadBreadcrumbs } from '../../../threads/detail/overview/ThreadBreadcrumbs'
import { ThreadDescription } from '../../../threads/detail/overview/ThreadDescription'
import { ThreadStatusButton } from '../../../threads/form/ThreadStatusButton'
import { ThreadSettings } from '../../../threads/settings'
import { countChangesetFilesChanged } from '../../preview/ChangesetSummaryBar'
import { ChangesetReviewLink } from '../changes/ChangesetReviewLink'
import { ChangesetReviewsList } from '../changes/ChangesetReviewsList'

interface Props extends ExtensionsControllerProps {
    thread: GQL.IDiscussionThread
    xchangeset: GQL.IChangeset
    onThreadUpdate: (thread: GQL.IDiscussionThread) => void
    threadSettings: ThreadSettings

    areaURL: string

    className?: string
    history: H.History
    location: H.Location
}

/**
 * The overview for a single changeset.
 */
export const ChangesetOverview: React.FunctionComponent<Props> = ({
    thread,
    xchangeset,
    onThreadUpdate,
    threadSettings,
    areaURL,
    className = '',
    ...props
}) => (
    // TODO!(sqs): uses style from other component
    <div className={`thread-overview ${className || ''}`}>
        <ThreadBreadcrumbs thread={thread} project={null /* TODO!(sqs) */} areaURL={areaURL} className="py-3" />
        <hr className="my-0" />
        <div className="d-flex align-items-center py-3">
            <ThreadStatusBadge thread={thread} className="mr-3" />
            <div>
                <small>
                    Opened <Timestamp date={thread.createdAt} /> by{' '}
                    <strong>
                        <PersonLink user={thread.author} />
                    </strong>
                </small>
            </div>
            <div className="flex-1" />
            <ThreadStatusButton
                {...props}
                thread={thread}
                onThreadUpdate={onThreadUpdate}
                className="ml-2"
                buttonClassName="btn-link btn-sm"
            />
        </div>
        <hr className="my-0" />
        <ThreadHeaderEditableTitle
            {...props}
            thread={thread}
            onThreadUpdate={onThreadUpdate}
            className="thread-overview__thread-title py-3" // TODO!(sqs): uses style from other component
        />
        <ThreadDescription {...props} thread={thread} onThreadUpdate={onThreadUpdate} className="mb-4" />
        <Timeline className="align-items-stretch mb-4">
            {threadSettings.plan && (
                <div className="d-flex align-items-start bg-body border p-4 mb-5 position-relative">
                    <ActionsIcon className="mb-0 mr-3" />
                    <Link to={`${areaURL}/operations`} className="stretched-link text-body">
                        {threadSettings.plan.operations.length}{' '}
                        {pluralize('operation', threadSettings.plan.operations.length)} applied
                    </Link>
                </div>
            )}
            <div className="d-flex align-items-center bg-body border p-4 mb-5">
                <GitPullRequestIcon className="icon-inline mb-0 mr-3" />
                Changes requested to {countChangesetFilesChanged(xchangeset)}{' '}
                {pluralize('file', countChangesetFilesChanged(xchangeset))} in {xchangeset.repositories.length}{' '}
                {pluralize('repository', xchangeset.repositories.length, 'repositories')}:
                {threadSettings.relatedPRs &&
                    threadSettings.relatedPRs.map((link, i) => (
                        <ChangesetReviewLink
                            key={i}
                            link={link}
                            showRepositoryName={true}
                            showIcon={true}
                            className="p-2 mr-3"
                            iconClassName="small text-success"
                        />
                    ))}
            </div>
            {/* <div className="d-flex align-items-start bg-body border p-4 mb-5 position-relative">
                <ChecksIcon className="mb-0 mr-3" />
                <Link to={`${areaURL}/tasks`} className="stretched-link text-body">
                    Review is not complete
                </Link>
            </div> */}
            <div className="d-flex align-items-center bg-body border p-4">
                <button type="button" className="btn btn-secondary text-muted mr-4" disabled={true}>
                    <GitPullRequestIcon className="mb-0 mr-3" />
                    Merge all
                </button>
                <span className="text-muted">Required review tasks are not yet complete</span>
            </div>
        </Timeline>
    </div>
)
