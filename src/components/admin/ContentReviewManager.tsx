import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Calendar,
  FileText,
  Code,
  Tag,
  RotateCcw
} from "lucide-react";
import { 
  useContentChangeRequests, 
  usePendingContentChangeRequests,
  useApproveContentChange,
  useDeclineContentChange,
  useRollbackContentChange,
  ContentChangeRequest 
} from "@/hooks/content/useContentChangeRequests";
import { useGetContentSection, getPageSections } from '@/hooks/content/useContentApplication';
import { format } from "date-fns";
import ContentAnalyzer from "./ContentAnalyzer";

interface ContentReviewItemProps {
  request: ContentChangeRequest;
  onApprove: (id: string, scheduledAt?: string, applyImmediately?: boolean, editedContent?: string) => void;
  onDecline: (id: string) => void;
  onRollback: (id: string) => void;
}

const ContentReviewItem: React.FC<ContentReviewItemProps> = ({ request, onApprove, onDecline, onRollback }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [editedContent, setEditedContent] = useState(request.proposed_content);
  
  const { section, exists, description, currentContent, selector } = useGetContentSection(
    request.page_slug, 
    request.section_identifier
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-warning"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-success"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'declined':
        return <Badge variant="outline" className="text-destructive"><XCircle className="w-3 h-3 mr-1" />Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'description':
        return <FileText className="w-4 h-4" />;
      case 'json-ld':
        return <Code className="w-4 h-4" />;
      case 'meta-tags':
        return <Tag className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleScheduledApprove = () => {
    onApprove(request.id, scheduledDate || undefined, false, editedContent);
    setIsScheduleOpen(false);
    setScheduledDate("");
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getContentTypeIcon(request.content_type)}
            <CardTitle className="text-lg">{request.page_title}</CardTitle>
            {getStatusBadge(request.status)}
          </div>
          <div className="flex gap-2">
            {request.status === 'approved' && request.can_rollback && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onRollback(request.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Rollback
              </Button>
            )}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {getContentTypeIcon(request.content_type)}
                    {request.page_title} - {request.content_type}
                  </DialogTitle>
                  <DialogDescription>
                    Reviewing changes for {request.section_identifier}
                  </DialogDescription>
                </DialogHeader>
                
                 <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                     <div>
                       <Label className="text-sm font-medium">Section Information</Label>
                       <div className="space-y-2 mt-2">
                         <div className="flex items-center gap-2">
                           <Badge variant="outline">{request.section_identifier}</Badge>
                           {exists && (
                             <Badge variant="secondary" className="text-xs">
                               {description}
                             </Badge>
                           )}
                         </div>
                         {selector && (
                           <div>
                             <span className="text-xs text-muted-foreground">Location:</span>
                             <code className="text-xs bg-background px-2 py-1 rounded ml-2">{selector}</code>
                           </div>
                         )}
                         {!exists && (
                           <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                             ⚠️ Section not found in current page structure
                           </div>
                         )}
                       </div>
                     </div>
                     <div>
                       <Label className="text-sm font-medium">Page Details</Label>
                       <div className="space-y-1 mt-2 text-sm">
                         <div><span className="text-muted-foreground">Page:</span> {request.page_slug}</div>
                         <div><span className="text-muted-foreground">Type:</span> {request.content_type}</div>
                         <div><span className="text-muted-foreground">Created:</span> {format(new Date(request.created_at), 'MMM dd, HH:mm')}</div>
                       </div>
                     </div>
                   </div>

                   {request.change_reason && (
                     <div>
                       <Label className="text-sm font-medium">Reason for Change</Label>
                       <p className="text-sm text-muted-foreground mt-1">{request.change_reason}</p>
                     </div>
                   )}
                   
                   {request.seo_keywords_added && request.seo_keywords_added.length > 0 && (
                     <div>
                       <Label className="text-sm font-medium">SEO Keywords Added</Label>
                       <div className="flex flex-wrap gap-1 mt-1">
                         {request.seo_keywords_added.map((keyword, index) => (
                           <Badge key={index} variant="secondary" className="text-xs">
                             {keyword}
                           </Badge>
                         ))}
                       </div>
                     </div>
                   )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-destructive">Current Content</Label>
                      <Textarea 
                        value={request.current_content} 
                        readOnly 
                        className="mt-1 min-h-[200px] bg-destructive/5 border-destructive/20"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-success">Proposed Content (Editable)</Label>
                      <Textarea 
                        value={editedContent} 
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="mt-1 min-h-[200px] bg-success/5 border-success/20"
                        placeholder="Edit the proposed content before approving..."
                      />
                    </div>
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onDecline(request.id)}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                    
                    <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Schedule Content Update</DialogTitle>
                          <DialogDescription>
                            Set a date and time for when this content should be published.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="scheduled-date">Scheduled Date & Time</Label>
                            <Input
                              id="scheduled-date"
                              type="datetime-local"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleScheduledApprove}>
                            Schedule Approval
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                     <Button 
                       onClick={() => onApprove(request.id, undefined, true, editedContent)}
                       disabled={!exists}
                       className="bg-green-600 hover:bg-green-700"
                     >
                       <CheckCircle className="w-4 h-4 mr-1" />
                       Apply Now
                     </Button>
                     
                     <Button 
                       variant="outline" 
                       onClick={() => onApprove(request.id, undefined, false, editedContent)}
                     >
                       <CheckCircle className="w-4 h-4 mr-1" />
                       Approve Only
                     </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription className="flex items-center gap-4 text-sm">
          <span>Section: {request.section_identifier}</span>
          {exists && (
            <Badge variant="secondary" className="text-xs">
              {description}
            </Badge>
          )}
          {!exists && (
            <Badge variant="destructive" className="text-xs">
              Section not found
            </Badge>
          )}
          <span>Type: {request.content_type}</span>
          <span>Created: {format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {request.change_reason && (
            <p className="text-sm text-muted-foreground">{request.change_reason}</p>
          )}
          {request.seo_keywords_added && request.seo_keywords_added.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground">Keywords:</span>
              {request.seo_keywords_added.slice(0, 3).map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {request.seo_keywords_added.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{request.seo_keywords_added.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ContentReviewManager() {
  const { data: allRequests, isLoading: isLoadingAll, refetch } = useContentChangeRequests();
  const { data: pendingRequests, isLoading: isLoadingPending } = usePendingContentChangeRequests();
  const approveRequest = useApproveContentChange();
  const declineRequest = useDeclineContentChange();
  const rollbackRequest = useRollbackContentChange();

  const handleApprove = (id: string, scheduledAt?: string, applyImmediately?: boolean, editedContent?: string) => {
    approveRequest.mutate({ id, scheduledAt, applyImmediately, editedContent });
  };

  const handleDecline = (id: string) => {
    declineRequest.mutate(id);
  };

  const handleRollback = (id: string) => {
    rollbackRequest.mutate(id);
  };

  const approvedRequests = allRequests?.filter(req => req.status === 'approved') || [];
  const declinedRequests = allRequests?.filter(req => req.status === 'declined') || [];

  if (isLoadingAll || isLoadingPending) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Review Manager</h2>
          <p className="text-muted-foreground">
            Review and approve AI-generated content updates for your website
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-warning">
            {pendingRequests?.length || 0} Pending
          </Badge>
          <Badge variant="outline" className="text-success">
            {approvedRequests.length} Approved
          </Badge>
          <Badge variant="outline" className="text-destructive">
            {declinedRequests.length} Declined
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending Review ({pendingRequests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="declined">
            Declined ({declinedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="test">
            Test Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Pending Reviews</h3>
                <p className="text-muted-foreground text-center">
                  All content changes have been reviewed. New AI-generated suggestions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests?.map((request) => (
              <ContentReviewItem
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onDecline={handleDecline}
                onRollback={handleRollback}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.map((request) => (
            <ContentReviewItem
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onRollback={handleRollback}
            />
          ))}
        </TabsContent>

        <TabsContent value="declined" className="space-y-4">
          {declinedRequests.map((request) => (
            <ContentReviewItem
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onRollback={handleRollback}
            />
          ))}
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <ContentAnalyzer onAnalysisComplete={() => refetch()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}