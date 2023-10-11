import {
  Clipboard,
  Check,
  ThumbsDown,
  ThumbsUp,
  LucideIcon,
} from 'lucide-react'
import VideoConversorWeb from '@/components/web/video-conversor-web'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import TextArea from '@/components/ui/text-area'
import { Icon } from '@/components/ui/icon'
import PromptWeb from '@/components/web/prompt-web'
import { api } from '@/lib/axios'
import DefaultPageLayout from '@/components/layout/default-page-layout'

interface PromptProps {
  id: string
  title: string
  template: string
}

export default function ControlStation() {
  const [prompts, setPrompts] = useState<PromptProps[] | null>(null)
  const [template, setTemplate] = useState<string>('')
  const [clipboardIcon, setClipboardIcon] = useState<LucideIcon>(Clipboard)
  const [aiResponse, setAiResponse] = useState<string | undefined>(undefined)

  function handleSelectChange(promptId: string) {
    const promptSelected = prompts?.find((prompt) => prompt.id === promptId)

    if (!promptSelected) {
      return
    }

    setTemplate(promptSelected.template)
  }

  const handleClipBoardClick = () => {
    setClipboardIcon(Check)

    setTimeout(() => {
      setClipboardIcon(Clipboard)
    }, 1500) // 1.5 sec
  }

  useEffect(() => {
    api.get('/prompts').then((res) => {
      setPrompts(res.data)
    })
  }, [])

  return (
    <DefaultPageLayout className="items-center h-screen py-0">
      <div className="bg-skin-fill text-skin-base h-screen max-w-screen-2xl pt-24 px-4 pb-6 flex flex-row gap-6">
        <div className="w-3/5 h-full flex flex-col gap-2">
          <div className="h-3/5 w-full flex flex-row gap-6">
            <VideoConversorWeb />
            <PromptWeb
              setCompletion={setAiResponse}
              setPrompt={handleSelectChange}
              prompt={template}
            />
          </div>
          <div className="flex-1 w-full">
            <TextArea
              placeholder="Include the prompt for the AI..."
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 h-full">
          {' '}
          {/* fulture response chat */}
          <div>
            {aiResponse ? (
              <div className="flex flex-row justify-between items-center px-4 py-2 border border-skin-bg-muted border-b-0 bg-zinc-700 rounded-t-md">
                <div className="flex flex-row gap-2 items-center">
                  <CopyToClipboard text={aiResponse}>
                    {React.createElement(clipboardIcon, {
                      onClick: handleClipBoardClick,
                      className:
                        'w-5 h-5 text-skin-muted  hover:text-skin-base cursor pointer',
                    })}
                  </CopyToClipboard>
                  <p
                    className={`text-sm text-skin-muted ${
                      clipboardIcon === Check ? 'block' : 'invisible'
                    }`}
                  >
                    Copied
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Icon Icon={ThumbsUp} />
                  <Icon Icon={ThumbsDown} />
                </div>
              </div>
            ) : null}
          </div>
          <TextArea
            placeholder="Result generated by AI..."
            className={`${
              aiResponse ? 'border-t-0 rounded-t-none' : 'border-t'
            }`}
            value={aiResponse}
            readOnly
          />
        </div>
      </div>
    </DefaultPageLayout>
  )
}
